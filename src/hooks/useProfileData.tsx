
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { useProfileManagement } from "./useProfileManagement";

export const useProfileData = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const {
    profileData,
    setProfileData,
    loadProfileData,
    saveProfile
  } = useProfileManagement(user);

  const fetchProfileDirectly = async () => {
    if (!user?.id) return;
    
    console.log('Fetching profile directly for user:', user.id);
    setIsLoading(true);
    
    try {
      const { profile, error } = await profileService.getProfile(user.id);
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfileError(error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } else if (profile) {
        console.log('Profile fetched successfully:', profile);
        loadProfileData(profile);
        setProfileError(null);
        
        // Set avatar URL from profile if it exists
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfileError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const success = await saveProfile(async () => {
      // Force refresh both auth profile and local profile data
      await Promise.all([
        refreshProfile(),
        fetchProfileDirectly()
      ]);
      setIsEditing(false);
      
      // Add a small delay to ensure data is fully refreshed
      setTimeout(() => {
        fetchProfileDirectly();
      }, 500);
    });
    setIsLoading(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    setIsLoading(true);
    const { avatarUrl: newAvatarUrl, error } = await profileService.uploadAvatar(user.id, file);
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else if (newAvatarUrl) {
      setAvatarUrl(newAvatarUrl);
      // Refresh profile to get updated data
      await fetchProfileDirectly();
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('Profile component mounted - user:', user?.id, 'userProfile:', userProfile, 'authLoading:', authLoading);
    
    if (!authLoading && user) {
      if (userProfile) {
        console.log('Loading profile data from userProfile:', userProfile);
        loadProfileData(userProfile);
        setProfileError(null);
        
        // Set avatar URL from userProfile if it exists
        if (userProfile.avatar_url) {
          setAvatarUrl(userProfile.avatar_url);
        }
      } else {
        console.log('User exists but no profile data, attempting to fetch...');
        fetchProfileDirectly();
      }
    } else if (!authLoading && !user) {
      console.log('No user found, redirecting to login');
      navigate("/login", { replace: true });
    }
  }, [user, userProfile, authLoading, navigate]);

  // Add effect to refresh profile data when component mounts or user changes
  useEffect(() => {
    if (user && !authLoading && !isLoading) {
      console.log('Refreshing profile data for mounted component');
      fetchProfileDirectly();
    }
  }, [user?.id]); // Only depend on user ID to avoid infinite loops

  return {
    user,
    authLoading,
    isLoading,
    profileError,
    profileData,
    setProfileData,
    isEditing,
    avatarUrl,
    handleSave,
    handleEditToggle,
    handleAvatarChange,
    fetchProfileDirectly
  };
};
