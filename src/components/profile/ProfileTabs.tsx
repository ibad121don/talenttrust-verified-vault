
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Award, Activity, Settings } from "lucide-react";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import ProfileSkills from "./ProfileSkills";
import ProfileActivity from "./ProfileActivity";
import ProfileSettings from "./ProfileSettings";

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

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  profileData: ProfileData;
  isEditing: boolean;
  onProfileDataChange: (data: ProfileData) => void;
}

const ProfileTabs = ({ 
  activeTab, 
  onTabChange, 
  profileData, 
  isEditing, 
  onProfileDataChange 
}: ProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-8">
        <TabsTrigger value="profile" className="flex flex-col items-center py-3 px-4">
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile Details</span>
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex flex-col items-center py-3 px-4">
          <Award className="h-5 w-5 mb-1" />
          <span className="text-xs">Skills & Qualifications</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex flex-col items-center py-3 px-4">
          <Activity className="h-5 w-5 mb-1" />
          <span className="text-xs">Recent Activity</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex flex-col items-center py-3 px-4">
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-xs">Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfilePersonalInfo 
          profileData={profileData}
          isEditing={isEditing}
          onProfileDataChange={onProfileDataChange}
        />
      </TabsContent>

      <TabsContent value="skills">
        <ProfileSkills />
      </TabsContent>

      <TabsContent value="activity">
        <ProfileActivity />
      </TabsContent>

      <TabsContent value="settings">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
