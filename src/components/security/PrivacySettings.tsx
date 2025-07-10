
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Download, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { gdprService } from "@/services/gdprService";
import { securityService } from "@/services/securityService";
import { useToast } from "@/hooks/use-toast";

export const PrivacySettings = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    dataProcessing: true,
    marketing: false,
    analytics: true,
    profileVisibility: 'private'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    try {
      const userSettings = await gdprService.getPrivacySettings();
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    }
  };

  const updateSetting = async (key: string, value: boolean | string) => {
    setLoading(true);
    try {
      const newSettings = { ...settings, [key]: value };
      await gdprService.updatePrivacySettings(newSettings);
      setSettings(newSettings);
      
      await securityService.logAuditEvent({
        user_id: userProfile?.id,
        action: 'privacy_setting_updated',
        resource_type: 'privacy',
        details: { setting: key, value }
      });

      toast({
        title: "Privacy Setting Updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy setting. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const exportData = async () => {
    setLoading(true);
    try {
      const data = await gdprService.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `trusttalent-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await securityService.logAuditEvent({
        user_id: userProfile?.id,
        action: 'data_export',
        resource_type: 'user_data',
        details: { export_type: 'full_data_export' }
      });

      toast({
        title: "Data Exported",
        description: "Your data has been successfully exported and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await gdprService.requestDataDeletion();
      
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive a confirmation email shortly.",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to process account deletion request. Please contact support.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Privacy & Data Settings
        </h2>
        <p className="text-muted-foreground">
          Manage how your personal data is processed and stored in accordance with GDPR.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Processing Consent</CardTitle>
          <CardDescription>
            Control how we process your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-processing">Essential Data Processing</Label>
              <p className="text-sm text-muted-foreground">
                Required for core application functionality
              </p>
            </div>
            <Switch
              id="data-processing"
              checked={settings.dataProcessing}
              onCheckedChange={(checked) => updateSetting('dataProcessing', checked)}
              disabled={loading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and services
              </p>
            </div>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={(checked) => updateSetting('marketing', checked)}
              disabled={loading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics">Analytics & Performance</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve the service with anonymous usage data
              </p>
            </div>
            <Switch
              id="analytics"
              checked={settings.analytics}
              onCheckedChange={(checked) => updateSetting('analytics', checked)}
              disabled={loading}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Control who can see your profile information
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.profileVisibility === 'private' ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                id="profile-visibility"
                checked={settings.profileVisibility === 'public'}
                onCheckedChange={(checked) => updateSetting('profileVisibility', checked ? 'public' : 'private')}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Rights</CardTitle>
          <CardDescription>
            Exercise your rights under GDPR and other data protection laws
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Export Your Data</h4>
              <p className="text-sm text-muted-foreground">
                Download a copy of all your personal data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={exportData}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={loading} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers. This includes:
                    <br />
                    <br />
                    • All uploaded documents and certificates
                    <br />
                    • Your profile and personal information
                    <br />
                    • Application history and messages
                    <br />
                    • Verification records
                    <br />
                    <br />
                    You will receive a confirmation email before the deletion is finalised.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
