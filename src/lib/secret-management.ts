import { randomBytes, createHmac, createCipher, createDecipher } from 'crypto';
import { config } from './env-config';

export interface SecretMetadata {
  id: string;
  name: string;
  value: string;
  encryptedValue: string;
  createdAt: Date;
  expiresAt: Date;
  lastRotated: Date;
  rotationInterval: number; // in milliseconds
  usageCount: number;
  isActive: boolean;
  tags: string[];
}

export interface RotationPolicy {
  name: string;
  interval: number; // in milliseconds
  minLength: number;
  complexity: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  autoRotation: boolean;
  notifyOnRotation: boolean;
}

// Default rotation policies
export const DEFAULT_ROTATION_POLICIES: Record<string, RotationPolicy> = {
  auth: {
    name: 'Authentication Secrets',
    interval: 90 * 24 * 60 * 60 * 1000, // 90 days
    minLength: 64,
    complexity: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
    autoRotation: true,
    notifyOnRotation: true,
  },
  
  csrf: {
    name: 'CSRF Tokens',
    interval: 30 * 24 * 60 * 60 * 1000, // 30 days
    minLength: 128,
    complexity: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
    autoRotation: true,
    notifyOnRotation: false,
  },
  
  api: {
    name: 'API Keys',
    interval: 180 * 24 * 60 * 60 * 1000, // 180 days
    minLength: 32,
    complexity: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
    autoRotation: true,
    notifyOnRotation: true,
  },
  
  encryption: {
    name: 'Encryption Keys',
    interval: 365 * 24 * 60 * 60 * 1000, // 1 year
    minLength: 32,
    complexity: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
    autoRotation: false, // Manual rotation for encryption keys
    notifyOnRotation: true,
  },
  
  database: {
    name: 'Database Credentials',
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    minLength: 16,
    complexity: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
    autoRotation: true,
    notifyOnRotation: true,
  },
};

// Secret store (use Redis or database in production)
class SecretStore {
  private secrets = new Map<string, SecretMetadata>();
  private encryptionKey: string;

  constructor() {
    // Use environment variable or generate a new encryption key
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateEncryptionKey();
  }

  // Generate encryption key for storing secrets
  private generateEncryptionKey(): string {
    const key = randomBytes(32).toString('hex');
    console.warn('⚠️  Generated new encryption key. Set ENCRYPTION_KEY environment variable for production.');
    return key;
  }

  // Encrypt a secret value
  private encryptSecret(value: string): string {
    const cipher = createCipher('aes-256-cbc', this.encryptionKey);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  // Decrypt a secret value
  private decryptSecret(encryptedValue: string): string {
    try {
      const decipher = createDecipher('aes-256-cbc', this.encryptionKey);
      let decrypted = decipher.update(encryptedValue, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt secret:', error);
      throw new Error('Secret decryption failed');
    }
  }

  // Store a new secret
  storeSecret(
    name: string,
    value: string,
    policy: RotationPolicy,
    tags: string[] = []
  ): string {
    const id = this.generateSecretId();
    const now = new Date();
    
    const secret: SecretMetadata = {
      id,
      name,
      value,
      encryptedValue: this.encryptSecret(value),
      createdAt: now,
      expiresAt: new Date(now.getTime() + policy.interval),
      lastRotated: now,
      rotationInterval: policy.interval,
      usageCount: 0,
      isActive: true,
      tags,
    };

    this.secrets.set(id, secret);
    return id;
  }

  // Retrieve a secret
  getSecret(id: string): string | null {
    const secret = this.secrets.get(id);
    if (!secret || !secret.isActive) {
      return null;
    }

    // Check if secret has expired
    if (new Date() > secret.expiresAt) {
      console.warn(`Secret ${secret.name} has expired`);
      return null;
    }

    // Increment usage count
    secret.usageCount++;
    
    return secret.value;
  }

  // Rotate a secret
  rotateSecret(id: string, newValue?: string): boolean {
    const secret = this.secrets.get(id);
    if (!secret) {
      return false;
    }

    const oldValue = secret.value;
    const newSecretValue = newValue || this.generateSecretByPolicy(secret.tags[0] || 'auth');
    
    // Update secret
    secret.value = newSecretValue;
    secret.encryptedValue = this.encryptSecret(newSecretValue);
    secret.lastRotated = new Date();
    secret.expiresAt = new Date(Date.now() + secret.rotationInterval);
    secret.usageCount = 0;

    // Log rotation
    console.log(`🔄 Secret ${secret.name} rotated successfully`);
    
    // Notify if required
    if (this.shouldNotifyOnRotation(secret.tags[0] || 'auth')) {
      this.notifySecretRotation(secret.name, oldValue, newSecretValue);
    }

    return true;
  }

  // Check if secrets need rotation
  checkRotationNeeded(): string[] {
    const now = new Date();
    const needsRotation: string[] = [];

    for (const [id, secret] of this.secrets.entries()) {
      if (secret.isActive && now > secret.expiresAt) {
        needsRotation.push(id);
      }
    }

    return needsRotation;
  }

  // Auto-rotate expired secrets
  autoRotateSecrets(): void {
    const expiredSecrets = this.checkRotationNeeded();
    
    for (const secretId of expiredSecrets) {
      const policy = this.getPolicyForSecret(secretId);
      if (policy?.autoRotation) {
        this.rotateSecret(secretId);
      }
    }
  }

  // Get policy for a secret
  private getPolicyForSecret(secretId: string): RotationPolicy | null {
    const secret = this.secrets.get(secretId);
    if (!secret) return null;

    const tag = secret.tags[0];
    return tag ? DEFAULT_ROTATION_POLICIES[tag] : null;
  }

  // Check if notification is required
  private shouldNotifyOnRotation(tag: string): boolean {
    const policy = DEFAULT_ROTATION_POLICIES[tag];
    return policy?.notifyOnRotation || false;
  }

  // Notify about secret rotation
  private notifySecretRotation(secretName: string, oldValue: string, newValue: string): void {
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      console.log(`🔔 Secret rotation notification: ${secretName}`);
      
      // Send to webhook if configured
      if (config.security.webhookUrl) {
        this.sendRotationNotification(secretName, oldValue, newValue);
      }
    }
  }

  // Send rotation notification
  private async sendRotationNotification(secretName: string, oldValue: string, newValue: string): Promise<void> {
    try {
      const payload = {
        event: 'secret_rotated',
        secretName,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        oldValueHash: this.hashValue(oldValue),
        newValueHash: this.hashValue(newValue),
      };

      await fetch(config.security.webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to send rotation notification:', error);
    }
  }

  // Hash a value for logging (don't log actual secrets)
  private hashValue(value: string): string {
    return createHmac('sha256', 'salt').update(value).digest('hex').substring(0, 8);
  }

  // Generate secret ID
  private generateSecretId(): string {
    return `secret_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  // Get all secrets (for monitoring)
  getAllSecrets(): SecretMetadata[] {
    return Array.from(this.secrets.values());
  }

  // Deactivate a secret
  deactivateSecret(id: string): boolean {
    const secret = this.secrets.get(id);
    if (secret) {
      secret.isActive = false;
      return true;
    }
    return false;
  }

  // Get secret statistics
  getSecretStats(): {
    total: number;
    active: number;
    expired: number;
    needsRotation: number;
  } {
    const total = this.secrets.size;
    const active = Array.from(this.secrets.values()).filter(s => s.isActive).length;
    const expired = this.checkRotationNeeded().length;
    const needsRotation = expired;

    return { total, active, expired, needsRotation };
  }
}

// Create global secret store
const secretStore = new SecretStore();

// Generate secret by policy
export function generateSecretByPolicy(policyName: string): string {
  const policy = DEFAULT_ROTATION_POLICIES[policyName];
  if (!policy) {
    throw new Error(`Unknown policy: ${policyName}`);
  }

  return generateSecretByRequirements(
    policy.minLength,
    policy.complexity.uppercase,
    policy.complexity.lowercase,
    policy.complexity.numbers,
    policy.complexity.symbols
  );
}

// Generate secret with specific requirements
export function generateSecretByRequirements(
  length: number,
  uppercase: boolean = true,
  lowercase: boolean = true,
  numbers: boolean = true,
  symbols: boolean = true
): string {
  let charset = '';
  let result = '';

  if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) charset += '0123456789';
  if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Ensure at least one character from each required category
  if (uppercase) result += charset.charAt(Math.floor(Math.random() * 26));
  if (lowercase) result += charset.charAt(26 + Math.floor(Math.random() * 26));
  if (numbers) result += charset.charAt(52 + Math.floor(Math.random() * 10));
  if (symbols) result += charset.charAt(62 + Math.floor(Math.random() * (charset.length - 62)));

  // Fill the rest randomly
  for (let i = result.length; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the result
  return result.split('').sort(() => Math.random() - 0.5).join('');
}

// Store a secret
export function storeSecret(
  name: string,
  value: string,
  policy: RotationPolicy,
  tags: string[] = []
): string {
  return secretStore.storeSecret(name, value, policy, tags);
}

// Get a secret
export function getSecret(id: string): string | null {
  return secretStore.getSecret(id);
}

// Rotate a secret
export function rotateSecret(id: string, newValue?: string): boolean {
  return secretStore.rotateSecret(id, newValue);
}

// Check rotation needs
export function checkRotationNeeded(): string[] {
  return secretStore.checkRotationNeeded();
}

// Auto-rotate secrets
export function autoRotateSecrets(): void {
  secretStore.autoRotateSecrets();
}

// Get secret statistics
export function getSecretStats() {
  return secretStore.getSecretStats();
}

// Get all secrets
export function getAllSecrets(): SecretMetadata[] {
  return secretStore.getAllSecrets();
}

// Deactivate a secret
export function deactivateSecret(id: string): boolean {
  return secretStore.deactivateSecret(id);
}

// Export policies for external use
export { DEFAULT_ROTATION_POLICIES, type RotationPolicy, type SecretMetadata };

// Initialize secret rotation monitoring
if (typeof window === 'undefined') {
  // Server-side only
  setInterval(() => {
    autoRotateSecrets();
  }, 60 * 60 * 1000); // Check every hour
}
