
import { supabase } from '@/integrations/supabase/client';

export interface Skill {
  id: string;
  name: string;
  verified: boolean;
  category: 'technical' | 'soft' | 'certification';
}

export class SkillsService {
  static async loadSkills(userDbId: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userDbId);

    if (error) throw error;
    
    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      verified: item.verified || false,
      category: item.category as 'technical' | 'soft' | 'certification'
    }));
  }

  static async addSkill(
    userDbId: string, 
    skillName: string, 
    category: 'technical' | 'soft' | 'certification' = 'technical'
  ): Promise<Skill> {
    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: userDbId,
        name: skillName,
        category,
        verified: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      verified: data.verified || false,
      category: data.category as 'technical' | 'soft' | 'certification'
    };
  }

  static async removeSkill(userDbId: string, skillId: string): Promise<void> {
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', skillId)
      .eq('user_id', userDbId);

    if (error) throw error;
  }
}
