
import { supabase } from '@/integrations/supabase/client';

export const userService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (!profile) {
      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          auth_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          user_type: 'job_seeker'
        })
        .select()
        .single();
      
      return newProfile;
    }

    return profile;
  },

  async refreshUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    return profile;
  }
};
