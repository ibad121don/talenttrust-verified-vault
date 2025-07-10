
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileNavigation from "./ProfileNavigation";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import { useProfileData } from "@/hooks/useProfileData";
import HomeFooter from "@/components/home/HomeFooter";

const ProfileLayout = () => {
  const {
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
  } = useProfileData();

  const [activeTab, setActiveTab] = useState("profile");

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect if no user (will happen automatically via useEffect in hook)
  if (!user) {
    return null;
  }

  // Show loading while fetching profile
  if (isLoading && !profileData.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  // Show error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading profile</div>
          <div className="text-sm text-gray-600 mb-4">{profileError}</div>
          <Button onClick={fetchProfileDirectly}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <ProfileNavigation />

      <div className="container mx-auto px-4 py-8">
        <ProfileHeader 
          profileData={profileData}
          isEditing={isEditing && !isLoading}
          onEditToggle={handleEditToggle}
          onSave={handleSave}
          avatarUrl={avatarUrl}
          onAvatarChange={handleAvatarChange}
        />

        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          profileData={profileData}
          isEditing={isEditing && !isLoading}
          onProfileDataChange={setProfileData}
        />
      </div>
      
      <HomeFooter />
    </div>
  );
};

export default ProfileLayout;
