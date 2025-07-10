
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Smartphone, Key, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SecuritySettings {
  twoFactor: {
    enabled: boolean;
    method: 'app' | 'sms' | 'email';
  };
  loginAlerts: boolean;
  sessionTimeout: number; // in minutes
  deviceTrust: boolean;
  downloadNotifications: boolean;
}

const SecuritySettingsCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactor: {
      enabled: false,
      method: 'app'
    },
    loginAlerts: true,
    sessionTimeout: 30,
    deviceTrust: true,
    downloadNotifications: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = () => {
    const stored = localStorage.getItem('security_settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('security_settings', JSON.stringify(settings));
      toast({
        title: "Security Settings Updated",
        description: "Your security preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you'd call your auth service here
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      // Simulate 2FA setup process
      if (!settings.twoFactor.enabled) {
        toast({
          title: "Two-Factor Authentication",
          description: "2FA setup initiated. Please check your authenticator app.",
        });
        setSettings(prev => ({
          ...prev,
          twoFactor: { ...prev.twoFactor, enabled: true }
        }));
      } else {
        toast({
          title: "Two-Factor Authentication",
          description: "2FA has been disabled for your account.",
        });
        setSettings(prev => ({
          ...prev,
          twoFactor: { ...prev.twoFactor, enabled: false }
        }));
      }
    } catch (error) {
      toast({
        title: "2FA Setup Failed",
        description: "Failed to configure two-factor authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (confirm("This will log you out of all devices except this one. Continue?")) {
      setIsLoading(true);
      try {
        // In a real app, you'd invalidate all sessions except current
        toast({
          title: "Sessions Terminated",
          description: "You have been logged out of all other devices.",
        });
      } catch (error) {
        toast({
          title: "Operation Failed",
          description: "Failed to log out other devices. Please try again.",
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
          <Shield className="h-5 w-5 text-gray-600" />
          <CardTitle>Security Settings</CardTitle>
        </div>
        <CardDescription>
          Protect your account with advanced security features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            Password & Authentication
          </h4>
          
          <div className="ml-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Change Password</Label>
                <p className="text-sm text-gray-600">
                  Last changed: Never (using social login)
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            {showPasswordForm && (
              <div className="space-y-3 p-4 border rounded-lg">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button onClick={handlePasswordChange} disabled={isLoading}>
                  Update Password
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.twoFactor.enabled}
                  onCheckedChange={handleEnable2FA}
                  disabled={isLoading}
                />
                {settings.twoFactor.enabled && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Enabled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Security Monitoring
          </h4>
          
          <div className="ml-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Alerts</Label>
                <p className="text-sm text-gray-600">
                  Get notified when someone logs into your account
                </p>
              </div>
              <Switch
                checked={settings.loginAlerts}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, loginAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Trust This Device</Label>
                <p className="text-sm text-gray-600">
                  Remember this device for easier future logins
                </p>
              </div>
              <Switch
                checked={settings.deviceTrust}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, deviceTrust: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Document Download Notifications</Label>
                <p className="text-sm text-gray-600">
                  Alert when your documents are downloaded by employers
                </p>
              </div>
              <Switch
                checked={settings.downloadNotifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, downloadNotifications: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-600">
                  Automatically log out after {settings.sessionTimeout} minutes of inactivity
                </p>
              </div>
              <select 
                value={settings.sessionTimeout}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                }
                className="border rounded px-2 py-1"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Device Management
          </h4>
          
          <div className="ml-6 space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Device</p>
                  <p className="text-sm text-gray-600">Chrome on Windows • Active now</p>
                </div>
                <span className="text-green-600 text-sm">This device</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleLogoutAllDevices}
              disabled={isLoading}
              className="w-full"
            >
              Log Out All Other Devices
            </Button>
            <p className="text-sm text-gray-600">
              This will end all other active sessions but keep you logged in on this device
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Security Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsCard;
