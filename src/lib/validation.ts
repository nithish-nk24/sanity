import DOMPurify from 'dompurify';

// Input length limits
export const INPUT_LIMITS = {
  username: { min: 3, max: 50 },
  password: { min: 8, max: 128 },
  email: { min: 5, max: 254 },
  name: { min: 2, max: 100 },
  title: { min: 3, max: 200 },
  description: { min: 10, max: 2000 },
  content: { min: 20, max: 10000 },
  bio: { min: 10, max: 500 },
  slug: { min: 3, max: 100 },
  metaTitle: { min: 10, max: 60 },
  metaDescription: { min: 50, max: 160 },
  metaKeywords: { min: 10, max: 200 },
  link: { min: 10, max: 500 },
  category: { min: 2, max: 50 },
  pitch: { min: 20, max: 500 }
} as const;

// File upload validation
export const FILE_VALIDATION = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
    maxDimensions: { width: 4000, height: 4000 }
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }
} as const;

// Input sanitization
export const sanitizeInput = (input: string, type: keyof typeof INPUT_LIMITS): string => {
  if (typeof input !== 'string') {
    throw new Error(`Invalid input type for ${type}. Expected string, got ${typeof input}`);
  }

  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Apply DOMPurify for XSS protection
  sanitized = DOMPurify.sanitize(sanitized, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
};

// Length validation
export const validateLength = (input: string, type: keyof typeof INPUT_LIMITS): { isValid: boolean; error?: string } => {
  const limits = INPUT_LIMITS[type];
  const length = input.length;
  
  if (length < limits.min) {
    return { 
      isValid: false, 
      error: `${type} must be at least ${limits.min} characters long` 
    };
  }
  
  if (length > limits.max) {
    return { 
      isValid: false, 
      error: `${type} must be no more than ${limits.max} characters long` 
    };
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Check for common email security issues
  if (email.includes('javascript:') || email.includes('data:') || email.includes('vbscript:')) {
    return { isValid: false, error: 'Email contains invalid content' };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  try {
    const urlObj = new URL(url);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }
    
    // Check for suspicious patterns
    if (url.includes('javascript:') || url.includes('data:') || url.includes('vbscript:')) {
      return { isValid: false, error: 'URL contains invalid content' };
    }
    
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// File validation
export const validateFile = (
  file: File, 
  type: keyof typeof FILE_VALIDATION
): { isValid: boolean; error?: string } => {
  const validation = FILE_VALIDATION[type];
  
  // Check file size
  if (file.size > validation.maxSize) {
    const maxSizeMB = validation.maxSize / (1024 * 1024);
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }
  
  // Check file type
  if (!validation.allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `File type not allowed. Allowed types: ${validation.allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

// Comprehensive input validation
export const validateInput = (
  input: string, 
  type: keyof typeof INPUT_LIMITS,
  options?: { 
    required?: boolean;
    allowHtml?: boolean;
    customValidation?: (input: string) => { isValid: boolean; error?: string };
  }
): { isValid: boolean; error?: string; sanitizedValue?: string } => {
  try {
    // Check if required
    if (options?.required && (!input || input.trim().length === 0)) {
      return { isValid: false, error: `${type} is required` };
    }
    
    // If not required and empty, return valid
    if (!options?.required && (!input || input.trim().length === 0)) {
      return { isValid: true, sanitizedValue: '' };
    }
    
    // Sanitize input
    const sanitized = sanitizeInput(input, type);
    
    // Validate length
    const lengthValidation = validateLength(sanitized, type);
    if (!lengthValidation.isValid) {
      return { isValid: false, error: lengthValidation.error };
    }
    
    // Special validation for specific types
    if (type === 'email') {
      const emailValidation = validateEmail(sanitized);
      if (!emailValidation.isValid) {
        return { isValid: false, error: emailValidation.error };
      }
    }
    
    if (type === 'link') {
      const urlValidation = validateUrl(sanitized);
      if (!urlValidation.isValid) {
        return { isValid: false, error: urlValidation.error };
      }
    }
    
    // Custom validation if provided
    if (options?.customValidation) {
      const customValidation = options.customValidation(sanitized);
      if (!customValidation.isValid) {
        return { isValid: false, error: customValidation.error };
      }
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  } catch (error) {
    return { 
      isValid: false, 
      error: `Validation error for ${type}: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Batch validation for forms
export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, { type: keyof typeof INPUT_LIMITS; required?: boolean }>
): { isValid: boolean; errors: Record<string, string>; sanitizedData: Record<string, string> } => {
  const errors: Record<string, string> = {};
  const sanitizedData: Record<string, string> = {};
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field] || '';
    const validation = validateInput(value, rules.type, { required: rules.required });
    
    if (!validation.isValid) {
      errors[field] = validation.error || `Invalid ${field}`;
    } else {
      sanitizedData[field] = validation.sanitizedValue || '';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

// Sanitize HTML content (for rich text editors)
export const sanitizeHtml = (html: string, allowedTags?: string[]): string => {
  const config = allowedTags ? { ALLOWED_TAGS: allowedTags } : {};
  return DOMPurify.sanitize(html, config);
};

// Prevent SQL injection (additional safety for custom queries)
export const sanitizeQueryParam = (param: string): string => {
  // Remove common SQL injection patterns
  const dangerousPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror)\b)/gi,
    /(['";])/g,
    /(--)/g,
    /(\/\*|\*\/)/g
  ];
  
  let sanitized = param;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};
