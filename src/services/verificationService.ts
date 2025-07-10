
import { supabase } from '@/integrations/supabase/client';

export interface VerificationResult {
  success: boolean;
  verification?: {
    id: string;
    status: string;
    explanation: string;
    confidence: number;
  };
  error?: string;
}

export const verificationService = {
  async verifyDocument(file: File, documentId?: string): Promise<VerificationResult> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      if (documentId) {
        formData.append('document_id', documentId);
      }

      const { data, error } = await supabase.functions.invoke('verify-document', {
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (error) {
        console.error('Verification service error:', error);
        throw new Error(error.message || 'Verification failed');
      }

      return data;
    } catch (error) {
      console.error('Error in verification service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getVerifications(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }
  },

  async getUserVerifications(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user verifications:', error);
      throw error;
    }
  }
};
