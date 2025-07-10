import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import VerificationManagement from "@/components/admin/VerificationManagement";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import { Shield, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminData } from "@/hooks/useAdminData";

const Admin = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { stats, loading: statsLoading, refreshStats } = useAdminData();

  useEffect(() => {
    // console.log('CHECK USER DATA', user);
    const checkAdminStatus = async () => {
      // if (!user) {
      //   setIsAdmin(false);
      //   setCheckingAdmin(false);
      //   // return;
      // }

      // try {
      //   console.log('Checking admin status for user:', user.id);

      //   // Get user from users table
      //   const { data: userData, error: userError } = await supabase
      //     .from('users')
      //     .select('id')
      //     .eq('auth_id', user.id)
      //     .single();

      //   if (userError || !userData) {
      //     console.log('User not found in users table:', userError);
      //     setIsAdmin(false);
      //     setCheckingAdmin(false);
      //     return;
      //   }

      //   console.log('Found user in users table:', userData.id);

      //   // Check if user has admin role
      //   const { data: roleData, error: roleError } = await supabase
      //     .from('user_roles')
      //     .select('role')
      //     .eq('user_id', userData.id)
      //     .eq('role', 'admin')
      //     .single();

      // let profile = await localStorage.getItem("userprofile");
      // let tempProfile = JSON.parse(profile);
      // const hasAdminRole = false;
      // console.log("Admin role check result:", hasAdminRole);

      setIsAdmin(false);
      setCheckingAdmin(false);
      // } catch (error) {
      //   console.error('Error checking admin status:', error);
      //   setIsAdmin(false);
      // } finally {
      //   setCheckingAdmin(false);
      // }
    };

    checkAdminStatus();
  }, [user]);

  // Show loading screen while checking authentication and admin status
  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  // if (!user || !isAdmin) {
  //   console.log("Redirecting to login - user:", !!user, "isAdmin:", isAdmin);
  //   return <Navigate to="/login" replace />;
  // }

  console.log("Rendering admin dashboard for user:", user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage document verifications and system settings
            </p>
          </div>
          <Button
            onClick={refreshStats}
            disabled={statsLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`}
            />
            Refresh Stats
          </Button>
        </div>

        <AdminStatsCards stats={stats} />

        <Tabs defaultValue="verifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verifications">
              Document Verifications
            </TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="mt-6">
            <VerificationManagement onStatusUpdate={refreshStats} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  User management interface coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
