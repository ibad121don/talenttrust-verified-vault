
import { supabase } from '@/integrations/supabase/client';

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  company: string;
  bio: string;
}

class ProfileService {
  async updateProfile(userId: string, data: UpdateProfileData): Promise<{ error?: string }> {
    try {
      console.log('Updating profile for user:', userId, 'with data:', data);
      
      // Ensure we have clean data with fallbacks for empty strings
      const updateData = {
        full_name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        email: data.email || '',
        phone: data.phone || null, // Use null instead of empty string for optional fields
        location: data.location || null,
        job_title: data.jobTitle || null,
        company: data.company || null,
        bio: data.bio || null,
        updated_at: new Date().toISOString()
      };

      console.log('Prepared update data:', updateData);

      // Update the user profile directly using auth_id
      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('auth_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return { error: error.message };
      }

      console.log('Profile updated successfully:', updatedProfile);
      return {};
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error: 'An unexpected error occurred while updating your profile.' };
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl?: string; error?: string }> {
    try {
      console.log('Uploading avatar for user:', userId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = fileName; // Simplified path structure

      console.log('Uploading to path:', filePath);

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return { error: uploadError.message };
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded successfully:', data.publicUrl);
      
      // Update the user's profile with the avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', userId);

      if (updateError) {
        console.error('Error updating avatar URL in profile:', updateError);
        // Still return success since upload worked
      }

      return { avatarUrl: data.publicUrl };
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      return { error: 'An unexpected error occurred while uploading your avatar.' };
    }
  }

  async getProfile(userId: string): Promise<{ profile?: any; error?: string }> {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Get the most recent profile for this user
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error) {
        // If no profile exists, create one
        if (error.code === 'PGRST116') {
          console.log('No profile found, creating default profile');
          
          // Get user data from auth to populate email
          const { data: { user } } = await supabase.auth.getUser();
          
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              auth_id: userId,
              email: user?.email || '',
              full_name: user?.user_metadata?.full_name || '',
              phone: null,
              location: null,
              job_title: null,
              company: null,
              bio: null,
              user_type: 'job_seeker'
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return { error: createError.message };
          }

          console.log('Profile created successfully:', newProfile);
          return { profile: newProfile };
        } else {
          console.error('Profile fetch error:', error);
          return { error: error.message };
        }
      }

      console.log('Profile fetched successfully:', profile);
      return { profile };
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      return { error: 'An unexpected error occurred while fetching your profile.' };
    }
  }
}

export const profileService = new ProfileService();
