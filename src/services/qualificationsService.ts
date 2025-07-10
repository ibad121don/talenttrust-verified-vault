
import { supabase } from '@/integrations/supabase/client';

export interface Qualification {
  id: string;
  title: string;
  institution: string;
  verified: boolean;
  dateObtained?: string;
}

export class QualificationsService {
  static async loadQualifications(userDbId: string): Promise<Qualification[]> {
    const { data, error } = await supabase
      .from('user_qualifications')
      .select('*')
      .eq('user_id', userDbId);

    if (error) throw error;
    
    return (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      institution: item.institution,
      verified: item.verified || false,
      dateObtained: item.date_obtained
    }));
  }

  static async addQualification(
    userDbId: string, 
    qualification: Omit<Qualification, 'id' | 'verified'>
  ): Promise<Qualification> {
    const { data, error } = await supabase
      .from('user_qualifications')
      .insert({
        user_id: userDbId,
        title: qualification.title,
        institution: qualification.institution,
        date_obtained: qualification.dateObtained,
        verified: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      institution: data.institution,
      verified: data.verified || false,
      dateObtained: data.date_obtained
    };
  }

  static async removeQualification(userDbId: string, qualificationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_qualifications')
      .delete()
      .eq('id', qualificationId)
      .eq('user_id', userDbId);

    if (error) throw error;
  }
}
