
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface ProfilePersonalInfoProps {
  profileData: ProfileData;
  isEditing: boolean;
  onProfileDataChange: (data: ProfileData) => void;
}

const ProfilePersonalInfo = ({ profileData, isEditing, onProfileDataChange }: ProfilePersonalInfoProps) => {
  const handleFieldChange = (field: keyof ProfileData, value: string) => {
    console.log(`Updating ${field} to:`, value);
    onProfileDataChange({
      ...profileData,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal details and contact information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className={!profileData.firstName && isEditing ? "text-red-500" : ""}>
              First Name {isEditing && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="firstName"
              value={profileData.firstName || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={!profileData.firstName && isEditing ? "border-red-500" : ""}
              placeholder={isEditing ? "Enter your first name" : ""}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              placeholder={isEditing ? "Enter your last name" : ""}
            />
          </div>
          <div>
            <Label htmlFor="email" className={!profileData.email && isEditing ? "text-red-500" : ""}>
              Email Address {isEditing && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData.email || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              className={!profileData.email && isEditing ? "border-red-500" : ""}
              placeholder={isEditing ? "Enter your email address" : ""}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profileData.phone || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder={isEditing ? "Enter your phone number" : ""}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profileData.location || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder={isEditing ? "Enter your location" : ""}
            />
          </div>
          <div>
            <Label htmlFor="jobTitle">Current Job Title</Label>
            <Input
              id="jobTitle"
              value={profileData.jobTitle || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
              placeholder={isEditing ? "Enter your job title" : ""}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={profileData.company || ''}
              disabled={!isEditing}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              placeholder={isEditing ? "Enter your company" : ""}
            />
          </div>
        </div>
        
        <div className="mt-6">
          <Label htmlFor="bio">Professional Summary</Label>
          <Textarea
            id="bio"
            rows={4}
            value={profileData.bio || ''}
            disabled={!isEditing}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            className="mt-1"
            placeholder={isEditing ? "Write a brief professional summary about yourself..." : ""}
          />
        </div>

        {isEditing && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="text-red-500">*</span> Required fields must be filled out before saving.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfilePersonalInfo;
