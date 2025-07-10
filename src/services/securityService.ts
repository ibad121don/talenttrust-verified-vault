
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

export interface SecurityEvent {
  event_type: 'failed_login' | 'suspicious_access' | 'data_breach_attempt' | 'unusual_location' | 'multiple_failed_attempts';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export interface AuditEvent {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: any;
}

class SecurityService {
  private encryptionKey: string;

  constructor() {
    // In production, this should come from secure environment variables
    this.encryptionKey = 'your-secure-encryption-key-here';
  }

  // Encryption methods using AES-256
  encryptData(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decryptData(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        throw new Error('Failed to decrypt data');
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generate file hash for integrity verification
  generateFileHash(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
          const hash = CryptoJS.SHA256(wordArray).toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Validate file type and size
  validateFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed. Please upload PDF, Word documents, or images only.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit.' };
    }

    return { valid: true };
  }

  // Get client IP address and user agent
  async getClientInfo(): Promise<{ ip_address?: string; user_agent: string }> {
    const user_agent = navigator.userAgent;
    let ip_address: string | undefined;

    try {
      // In production, you might use a service to get the real IP
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ip_address = data.ip;
    } catch (error) {
      console.warn('Could not fetch IP address:', error);
    }

    return { ip_address, user_agent };
  }

  // Log security events
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const clientInfo = await this.getClientInfo();
      
      const { error } = await supabase.rpc('log_security_event', {
        p_event_type: event.event_type,
        p_user_id: event.user_id || null,
        p_ip_address: event.ip_address || clientInfo.ip_address || null,
        p_user_agent: event.user_agent || clientInfo.user_agent,
        p_location: event.location || null,
        p_severity: event.severity || 'medium',
        p_details: event.details || null
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  // Log audit events
  async logAuditEvent(event: AuditEvent): Promise<void> {
    try {
      const clientInfo = await this.getClientInfo();
      
      const { error } = await supabase.rpc('log_audit_event', {
        p_user_id: event.user_id,
        p_action: event.action,
        p_resource_type: event.resource_type,
        p_resource_id: event.resource_id || null,
        p_ip_address: event.ip_address || clientInfo.ip_address || null,
        p_user_agent: event.user_agent || clientInfo.user_agent,
        p_details: event.details || null
      });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  // Check for suspicious activity
  detectSuspiciousActivity(user_id: string, ip_address?: string): Promise<boolean> {
    // This would contain logic to detect unusual patterns
    // For now, we'll implement basic checks
    return Promise.resolve(false);
  }

  // Rate limiting check
  async checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
        return true;
      }

      const data = JSON.parse(stored);
      if (now - data.timestamp > windowMs) {
        localStorage.setItem(key, JSON.stringify({ count: 1, timestamp: now }));
        return true;
      }

      if (data.count >= limit) {
        return false;
      }

      data.count++;
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return true; // Fail open
    }
  }
}

export const securityService = new SecurityService();
