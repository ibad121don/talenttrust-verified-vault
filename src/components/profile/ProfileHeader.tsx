
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Camera, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface ProfileHeaderProps {
  profileData: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  avatarUrl?: string;
  onAvatarChange: (file: File) => void;
}

const ProfileHeader = ({ 
  profileData, 
  isEditing, 
  onEditToggle, 
  onSave,
  avatarUrl,
  onAvatarChange
}: ProfileHeaderProps) => {
  const getInitials = () => {
    const firstInitial = profileData.firstName?.charAt(0) || '';
    const lastInitial = profileData.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
          {/* Edit Button - Top Right on Mobile */}
          <div className="w-full flex justify-end sm:absolute sm:top-4 sm:right-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button size="sm" onClick={onSave} className="bg-[#183B6B] hover:bg-[#183B6B]/90">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={onEditToggle}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={onEditToggle}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
              <AvatarImage src={avatarUrl} alt="Profile" />
              <AvatarFallback className="bg-[#183B6B] text-white text-lg sm:text-xl font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#183B6B] text-white p-1.5 rounded-full cursor-pointer hover:bg-[#183B6B]/90 transition-colors">
                <Camera className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name and Title */}
          <div className="space-y-2 w-full max-w-md">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 break-words">
              {profileData.jobTitle || "Add your job title"}
            </p>
            <p className="text-sm text-gray-500 break-all">
              {profileData.email}
            </p>
          </div>

          {/* Verification Status and Documents */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full justify-center">
            <Badge 
              variant="secondary" 
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm font-medium"
            >
              ✓ {profileData.verificationScore}% Verified
            </Badge>
            <div className="text-sm text-gray-600 font-medium">
              {profileData.documentsVerified}/{profileData.totalDocuments} Documents
            </div>
          </div>

          {/* Bio Section */}
          {profileData.bio && (
            <div className="w-full max-w-2xl">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed break-words">
                {profileData.bio}
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 w-full justify-center items-center">
            {profileData.location && (
              <span className="break-words text-center">{profileData.location}</span>
            )}
            {profileData.company && (
              <>
                {profileData.location && <span className="hidden sm:inline">•</span>}
                <span className="break-words text-center">{profileData.company}</span>
              </>
            )}
            {profileData.joinDate && (
              <>
                {(profileData.location || profileData.company) && <span className="hidden sm:inline">•</span>}
                <span className="text-center">Joined {profileData.joinDate}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
