
import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

export interface UserDataExport {
  personal_information: any;
  documents: any[];
  audit_logs: any[];
  verification_requests: any[];
  verification_results: any[];
  references: any[];
}

export interface PrivacySettings {
  dataProcessing: boolean;
  marketing: boolean;
  analytics: boolean;
  profileVisibility: string;
}

class GdprService {
  // Get user privacy settings
  async getPrivacySettings(): Promise<PrivacySettings | null> {
    try {
      // For now, return default settings since we don't have a privacy_settings table
      // In a real implementation, you'd store these in a database table
      const stored = localStorage.getItem('privacy_settings');
      if (stored) {
        return JSON.parse(stored);
      }
      
      return {
        dataProcessing: true,
        marketing: false,
        analytics: true,
        profileVisibility: 'private'
      };
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      return null;
    }
  }

  // Update user privacy settings
  async updatePrivacySettings(settings: PrivacySettings): Promise<void> {
    try {
      // Store in localStorage for now
      // In a real implementation, you'd store these in a database table
      localStorage.setItem('privacy_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  // Export all user data for GDPR compliance
  async exportUserData(userId?: string): Promise<UserDataExport | null> {
    try {
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No authenticated user');
        userId = user.id;
      }

      await securityService.logAuditEvent({
        user_id: userId,
        action: 'data_export_request',
        resource_type: 'user_data',
        details: { gdpr_compliance: true }
      });

      // Get user profile
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      // Get user documents
      const { data: documents } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id || userId);

      // Get audit logs
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user?.id || userId);

      // Get verification requests
      const { data: verificationRequests } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('user_id', user?.id || userId);

      // Get verification results
      const { data: verificationResults } = await supabase
        .from('verification_results')
        .select('*')
        .in('document_id', documents?.map(d => d.id) || []);

      // Get references
      const { data: references } = await supabase
        .from('references')
        .select('*')
        .eq('user_id', user?.id || userId);

      const exportData: UserDataExport = {
        personal_information: user,
        documents: documents || [],
        audit_logs: auditLogs || [],
        verification_requests: verificationRequests || [],
        verification_results: verificationResults || [],
        references: references || []
      };

      await securityService.logAuditEvent({
        user_id: userId,
        action: 'data_export_completed',
        resource_type: 'user_data',
        details: { 
          gdpr_compliance: true,
          records_exported: {
            documents: documents?.length || 0,
            audit_logs: auditLogs?.length || 0,
            verification_requests: verificationRequests?.length || 0,
            verification_results: verificationResults?.length || 0,
            references: references?.length || 0
          }
        }
      });

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // Request data deletion for GDPR compliance
  async requestDataDeletion(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      await securityService.logAuditEvent({
        user_id: user.id,
        action: 'data_deletion_request',
        resource_type: 'user_data',
        details: { gdpr_compliance: true }
      });

      // In a real implementation, this would trigger a workflow
      // For now, we'll just log the request
      console.log('Data deletion request submitted for user:', user.id);
      
      return true;
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      return false;
    }
  }

  // Download user data as JSON file
  downloadUserData(data: UserDataExport, filename?: string): void {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `user_data_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const gdprService = new GdprService();
