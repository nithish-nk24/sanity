import { NextRequest } from 'next/server';

export interface SecurityEvent {
  type: 'rate_limit_exceeded' | 'validation_failed' | 'authentication_failed' | 'suspicious_activity' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: {
    ip?: string;
    userAgent?: string;
    url: string;
    method: string;
    timestamp: string;
    userId?: string;
    [key: string]: any;
  };
}

export interface SecurityAlert {
  id: string;
  event: SecurityEvent;
  createdAt: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private suspiciousPatterns: Map<string, number> = new Map();
  private maxEvents = 1000; // Keep last 1000 events
  private maxAlerts = 100; // Keep last 100 alerts

  // Record a security event
  recordEvent(event: SecurityEvent): void {
    this.events.push(event);
    
    // Keep only the last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Check if this should trigger an alert
    if (this.shouldTriggerAlert(event)) {
      this.createAlert(event);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔒 Security Event [${event.severity.toUpperCase()}]:`, event);
    }

    // In production, you'd send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      this.logToExternalService(event);
    }
  }

  // Check if an event should trigger an alert
  private shouldTriggerAlert(event: SecurityEvent): boolean {
    // Always alert on critical events
    if (event.severity === 'critical') {
      return true;
    }

    // Alert on high severity events
    if (event.severity === 'high') {
      return true;
    }

    // Check for suspicious patterns
    const patternKey = `${event.details.ip}_${event.type}`;
    const currentCount = this.suspiciousPatterns.get(patternKey) || 0;
    
    if (currentCount >= 5) { // Alert after 5 similar events
      return true;
    }

    // Update pattern count
    this.suspiciousPatterns.set(patternKey, currentCount + 1);
    
    return false;
  }

  // Create a security alert
  private createAlert(event: SecurityEvent): void {
    const alert: SecurityAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      event,
      createdAt: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.push(alert);
    
    // Keep only the last maxAlerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    // In production, you'd send this to an alerting service
    if (process.env.NODE_ENV === 'production') {
      this.sendAlertNotification(alert);
    }
  }

  // Get recent security events
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.events.slice(-limit).reverse();
  }

  // Get active alerts
  getActiveAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  // Acknowledge an alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
      alert.acknowledgedBy = acknowledgedBy;
      return true;
    }
    return false;
  }

  // Get security statistics
  getSecurityStats(): {
    totalEvents: number;
    totalAlerts: number;
    activeAlerts: number;
    eventsBySeverity: Record<string, number>;
    eventsByType: Record<string, number>;
  } {
    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.events.length,
      totalAlerts: this.alerts.length,
      activeAlerts: this.alerts.filter(a => !a.acknowledged).length,
      eventsBySeverity,
      eventsByType
    };
  }

  // Check if an IP is suspicious
  isSuspiciousIP(ip: string): boolean {
    const ipEvents = this.events.filter(event => event.details.ip === ip);
    const recentEvents = ipEvents.filter(event => {
      const eventTime = new Date(event.details.timestamp).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return eventTime > oneHourAgo;
    });

    // Consider suspicious if more than 10 events in the last hour
    return recentEvents.length > 10;
  }

  // Log to external service (placeholder for production)
  private logToExternalService(event: SecurityEvent): void {
    // In production, you'd send this to:
    // - Log aggregation service (e.g., DataDog, LogRocket)
    // - Security monitoring service (e.g., Sentry, LogRocket)
    // - SIEM system
    // - Custom logging endpoint
    
    // Example: Send to external logging service
    if (process.env.SECURITY_WEBHOOK_URL) {
      fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(error => {
        console.error('Failed to send security event to external service:', error);
      });
    }
  }

  // Send alert notification (placeholder for production)
  private sendAlertNotification(alert: SecurityAlert): void {
    // In production, you'd send this to:
    // - Email service
    // - Slack/Discord webhook
    // - PagerDuty
    // - SMS service
    
    // Example: Send to Slack webhook
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackMessage = {
        text: `🚨 Security Alert: ${alert.event.message}`,
        attachments: [{
          color: this.getSeverityColor(alert.event.severity),
          fields: [
            { title: 'Severity', value: alert.event.severity, short: true },
            { title: 'Type', value: alert.event.type, short: true },
            { title: 'IP', value: alert.event.details.ip || 'Unknown', short: true },
            { title: 'URL', value: alert.event.details.url, short: true },
            { title: 'Timestamp', value: new Date(alert.event.details.timestamp).toLocaleString(), short: true }
          ]
        }]
      };

      fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      }).catch(error => {
        console.error('Failed to send Slack notification:', error);
      });
    }
  }

  // Get color for severity level
  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffcc00';
      case 'low': return '#00cc00';
      default: return '#999999';
    }
  }
}

// Create singleton instance
export const securityMonitor = new SecurityMonitor();

// Helper functions for common security events
export function recordRateLimitExceeded(req: NextRequest, ip: string): void {
  securityMonitor.recordEvent({
    type: 'rate_limit_exceeded',
    severity: 'medium',
    message: 'Rate limit exceeded for IP address',
    details: {
      ip,
      userAgent: req.headers.get('user-agent') || 'Unknown',
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
}

export function recordValidationFailure(req: NextRequest, ip: string, errors: string[]): void {
  securityMonitor.recordEvent({
    type: 'validation_failed',
    severity: 'low',
    message: 'Request validation failed',
    details: {
      ip,
      userAgent: req.headers.get('user-agent') || 'Unknown',
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      validationErrors: errors
    }
  });
}

export function recordAuthenticationFailure(req: NextRequest, ip: string, reason: string): void {
  securityMonitor.recordEvent({
    type: 'authentication_failed',
    severity: 'medium',
    message: 'Authentication attempt failed',
    details: {
      ip,
      userAgent: req.headers.get('user-agent') || 'Unknown',
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      failureReason: reason
    }
  });
}

export function recordSuspiciousActivity(req: NextRequest, ip: string, activity: string): void {
  securityMonitor.recordEvent({
    type: 'suspicious_activity',
    severity: 'high',
    message: 'Suspicious activity detected',
    details: {
      ip,
      userAgent: req.headers.get('user-agent') || 'Unknown',
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
      activity
    }
  });
}
