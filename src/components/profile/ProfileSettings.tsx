
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PrivacySettingsCard from "./PrivacySettingsCard";
import NotificationSettingsCard from "./NotificationSettingsCard";
import SecuritySettingsCard from "./SecuritySettingsCard";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      {/* Account Settings Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
        <p className="text-gray-600 mb-6">Manage your account preferences and security</p>
        
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="privacy">
            <AccordionTrigger className="text-lg font-semibold">
              Privacy Settings
            </AccordionTrigger>
            <AccordionContent>
              <PrivacySettingsCard />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notifications">
            <AccordionTrigger className="text-lg font-semibold">
              Notification Preferences
            </AccordionTrigger>
            <AccordionContent>
              <NotificationSettingsCard />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger className="text-lg font-semibold">
              Security Settings
            </AccordionTrigger>
            <AccordionContent>
              <SecuritySettingsCard />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Account Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Actions</h2>
        <p className="text-gray-600 mb-6">Important account management options</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign Out</CardTitle>
            <CardDescription>End your current session and return to the home page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
