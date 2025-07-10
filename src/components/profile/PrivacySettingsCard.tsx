
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { gdprService, PrivacySettings } from "@/services/gdprService";

const PrivacySettingsCard = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings>({
    dataProcessing: true,
    marketing: false,
    analytics: true,
    profileVisibility: 'private'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const privacySettings = await gdprService.getPrivacySettings();
      if (privacySettings) {
        setSettings(privacySettings);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await gdprService.updatePrivacySettings(settings);
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const exportData = await gdprService.exportUserData();
      if (exportData) {
        gdprService.downloadUserData(exportData);
        toast({
          title: "Data Export Complete",
          description: "Your personal data has been downloaded as a JSON file.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (confirm("Are you sure you want to request deletion of all your personal data? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const success = await gdprService.requestDataDeletion();
        if (success) {
          toast({
            title: "Deletion Request Submitted",
            description: "Your data deletion request has been submitted and will be processed within 30 days.",
          });
        }
      } catch (error) {
        toast({
          title: "Request Failed",
          description: "Failed to submit deletion request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-gray-600" />
          <CardTitle>Privacy Settings</CardTitle>
        </div>
        <CardDescription>
          Manage how your personal information is collected, used, and shared
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-processing">Data Processing</Label>
              <p className="text-sm text-gray-600">
                Allow us to process your personal data for service functionality
              </p>
            </div>
            <Switch
              id="data-processing"
              checked={settings.dataProcessing}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, dataProcessing: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing Communications</Label>
              <p className="text-sm text-gray-600">
                Receive emails about new features, updates, and promotions
              </p>
            </div>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, marketing: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics">Analytics & Performance</Label>
              <p className="text-sm text-gray-600">
                Help us improve our service by sharing anonymous usage data
              </p>
            </div>
            <Switch
              id="analytics"
              checked={settings.analytics}
              onCheckedChange={(checked) => 
                setSettings(prev => ({ ...prev, analytics: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select 
              value={settings.profileVisibility} 
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, profileVisibility: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="employers">Employers Only - Visible to verified employers</SelectItem>
                <SelectItem value="private">Private - Only visible to you</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              Control who can see your profile information and verification status
            </p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium mb-4">Data Rights (GDPR)</h4>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isLoading}
              className="w-full justify-start"
            >
              Download My Data
            </Button>
            <p className="text-sm text-gray-600">
              Export all your personal data in a machine-readable format
            </p>

            <Button 
              variant="outline" 
              onClick={handleRequestDeletion}
              disabled={isLoading}
              className="w-full justify-start text-red-600 hover:text-red-700"
            >
              Request Data Deletion
            </Button>
            <p className="text-sm text-gray-600">
              Request permanent deletion of all your personal data
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Privacy Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsCard;
