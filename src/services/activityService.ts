
import { supabase } from '@/integrations/supabase/client';

export class ActivityService {
  static async logActivity(userId: string, action: string, details: string, activityType: string = 'general') {
    try {
      // Use any to bypass TypeScript checking for the new table
      const { error } = await (supabase as any)
        .from('user_activities')
        .insert({
          user_id: userId,
          action,
          details,
          activity_type: activityType
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  static async logDocumentUpload(userId: string, documentName: string) {
    await this.logActivity(
      userId,
      'Document uploaded',
      documentName,
      'document'
    );
  }

  static async logDocumentVerification(userId: string, documentName: string) {
    await this.logActivity(
      userId,
      'Document verified',
      documentName,
      'verification'
    );
  }

  static async logProfileUpdate(userId: string, updateType: string) {
    await this.logActivity(
      userId,
      'Profile updated',
      updateType,
      'profile'
    );
  }

  static async logJobApplication(userId: string, jobTitle: string) {
    await this.logActivity(
      userId,
      'Application sent',
      jobTitle,
      'application'
    );
  }
}

export const activityService = ActivityService;
