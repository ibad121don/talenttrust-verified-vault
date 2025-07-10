
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { profileService, UpdateProfileData } from '@/services/profileService';
import { activityService } from '@/services/activityService';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  company: string;
  bio: string;
  joinDate: string;
  verificationScore: number;
  documentsVerified: number;
  totalDocuments: number;
}

export const useProfileManagement = (user: any) => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    company: "",
    bio: "",
    joinDate: "",
    verificationScore: 0,
    documentsVerified: 0,
    totalDocuments: 0
  });

  const loadProfileData = (profile: any) => {
    console.log('Loading profile data:', profile);
    
    const nameParts = profile.full_name?.split(' ') || [''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const newProfileData = {
      firstName,
      lastName,
      email: profile.email || user?.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      jobTitle: profile.job_title || '',
      company: profile.company || '',
      bio: profile.bio || '',
      joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : '',
      verificationScore: profile.verification_score || 0,
      documentsVerified: profile.documents_verified || 0,
      totalDocuments: profile.total_documents || 0
    };

    console.log('Setting profile data to:', newProfileData);
    setProfileData(newProfileData);
  };

  const saveProfile = async (onSuccess?: () => void) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile",
        variant: "destructive",
      });
      return false;
    }

    if (!profileData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!profileData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }

    const updateData: UpdateProfileData = {
      firstName: profileData.firstName.trim(),
      lastName: profileData.lastName.trim(),
      email: profileData.email.trim(),
      phone: profileData.phone.trim(),
      location: profileData.location.trim(),
      jobTitle: profileData.jobTitle.trim(),
      company: profileData.company.trim(),
      bio: profileData.bio.trim()
    };

    console.log('Saving profile data:', updateData);

    try {
      const { error } = await profileService.updateProfile(user.id, updateData);
      
      if (error) {
        console.error('Profile save error:', error);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return false;
      } else {
        console.log('Profile saved successfully');
        
        // Log the profile update activity
        await activityService.logProfileUpdate(user.id, 'Personal information updated');
        
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        
        // Call onSuccess callback which should refresh the data
        if (onSuccess) {
          await onSuccess();
        }
        
        return true;
      }
    } catch (error) {
      console.error('Unexpected error saving profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving your profile",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    profileData,
    setProfileData,
    loadProfileData,
    saveProfile
  };
};
