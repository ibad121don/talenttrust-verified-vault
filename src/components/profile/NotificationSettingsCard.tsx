
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Mail, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  emailNotifications: {
    verificationUpdates: boolean;
    documentExpiry: boolean;
    securityAlerts: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
  };
  pushNotifications: {
    verificationComplete: boolean;
    documentExpiring: boolean;
    securityAlerts: boolean;
    newMessages: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const NotificationSettingsCard = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: {
      verificationUpdates: true,
      documentExpiry: true,
      securityAlerts: true,
      marketingEmails: false,
      weeklyDigest: true,
    },
    pushNotifications: {
      verificationComplete: true,
      documentExpiring: true,
      securityAlerts: true,
      newMessages: false,
    },
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = () => {
    const stored = localStorage.getItem('notification_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('notification_settings', JSON.stringify(settings));
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmailSetting = (key: keyof typeof settings.emailNotifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value
      }
    }));
  };

  const updatePushSetting = (key: keyof typeof settings.pushNotifications, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5 text-gray-600" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>
          Choose how and when you want to receive notifications about your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Notifications
          </h4>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verification Updates</Label>
                <p className="text-sm text-gray-600">
                  When your documents are verified or require attention
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.verificationUpdates}
                onCheckedChange={(checked) => updateEmailSetting('verificationUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Document Expiry Warnings</Label>
                <p className="text-sm text-gray-600">
                  30 days before your documents expire
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.documentExpiry}
                onCheckedChange={(checked) => updateEmailSetting('documentExpiry', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-gray-600">
                  Important security notifications and login alerts
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.securityAlerts}
                onCheckedChange={(checked) => updateEmailSetting('securityAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Digest</Label>
                <p className="text-sm text-gray-600">
                  Summary of your account activity and tips
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.weeklyDigest}
                onCheckedChange={(checked) => updateEmailSetting('weeklyDigest', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-gray-600">
                  Product updates, features, and promotional content
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications.marketingEmails}
                onCheckedChange={(checked) => updateEmailSetting('marketingEmails', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Push Notifications
          </h4>
          
          <div className="space-y-3 ml-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verification Complete</Label>
                <p className="text-sm text-gray-600">
                  Instant notification when verification is finished
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.verificationComplete}
                onCheckedChange={(checked) => updatePushSetting('verificationComplete', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Document Expiring Soon</Label>
                <p className="text-sm text-gray-600">
                  Push notification for expiring documents
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.documentExpiring}
                onCheckedChange={(checked) => updatePushSetting('documentExpiring', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-gray-600">
                  Critical security notifications
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.securityAlerts}
                onCheckedChange={(checked) => updatePushSetting('securityAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Messages</Label>
                <p className="text-sm text-gray-600">
                  Notifications for new messages from employers
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications.newMessages}
                onCheckedChange={(checked) => updatePushSetting('newMessages', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Notification Frequency</h4>
          <Select 
            value={settings.frequency} 
            onValueChange={(value: 'immediate' | 'daily' | 'weekly') => 
              setSettings(prev => ({ ...prev, frequency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate - As they happen</SelectItem>
              <SelectItem value="daily">Daily Digest - Once per day</SelectItem>
              <SelectItem value="weekly">Weekly Summary - Once per week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Quiet Hours</Label>
              <p className="text-sm text-gray-600">
                Pause non-urgent notifications during specified hours
              </p>
            </div>
            <Switch
              checked={settings.quietHours.enabled}
              onCheckedChange={(checked) => 
                setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, enabled: checked }
                }))
              }
            />
          </div>

          {settings.quietHours.enabled && (
            <div className="flex gap-4 ml-6">
              <div className="flex-1">
                <Label>Start Time</Label>
                <Select 
                  value={settings.quietHours.start}
                  onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label>End Time</Label>
                <Select 
                  value={settings.quietHours.end}
                  onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Notification Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsCard;
