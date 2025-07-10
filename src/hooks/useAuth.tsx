import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthSession } from "./useAuthSession";
import { userProfileService } from "@/services/userProfileService";

interface AuthContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: string | null; isAdmin?: boolean }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    userType: string
  ) => Promise<{ user: User | null; error: string | null }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: sessionLoading } = useAuthSession();
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log("Checking admin status for user:", user.id);
      const isAdmin = await authService.checkAdminStatus(user.id);
      console.log("Admin status result:", isAdmin);
      return isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setProfileLoading(true);
      const profile = await userProfileService.fetchUserProfile(user.id);
      setUserProfile(profile);
      setProfileLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login({ email, password });
      if (result.user && !result.error) {
        console.log(
          "Login successful, user:",
          result.user.id,
          "isAdmin:",
          result.isAdmin
        );
      }
      return result;
    } catch (error: any) {
      console.error("Login error:", error);
      return { user: null, error: error.message || "Login failed" };
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    userType: string
  ) => {
    try {
      const result = await authService.register({
        email,
        password,
        fullName,
        userType: userType as any,
      });
      return result;
    } catch (error: any) {
      console.error("Registration error:", error);
      return { user: null, error: error.message || "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUserProfile(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const signOut = async () => {
    await logout();
  };

  useEffect(() => {
    if (user && !userProfile && !profileLoading) {
      refreshProfile();
    } else if (!user) {
      setUserProfile(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading: sessionLoading || profileLoading,
        login,
        register,
        logout,
        signOut,
        refreshProfile,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
