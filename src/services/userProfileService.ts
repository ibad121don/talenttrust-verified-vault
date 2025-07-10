import { supabase } from '@/integrations/supabase/client';

export const userProfileService = {
  async fetchUserProfile(userId: string) {
    console.log('Fetching user profile for:', userId);
    try {
      // First, try to get the most recent profile for this user
      const { data: profiles, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // If we have a profile, return the most recent one
      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        console.log('User profile fetched:', profile);
        
        // If there are multiple profiles, clean up duplicates (keep the most recent)
        if (profiles.length > 1) {
          console.log('Multiple profiles found, cleaning up duplicates');
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('auth_id', userId)
            .neq('id', profile.id);
          
          if (deleteError) {
            console.error('Error cleaning up duplicate profiles:', deleteError);
          }
        }
        
        return profile;
      }

      // If no profile exists, create one
      console.log('No profile found, creating new profile');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            auth_id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
            user_type: 'job_seeker'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return null;
        } else {
          console.log('User profile created:', newProfile);
          return newProfile;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  }
};
