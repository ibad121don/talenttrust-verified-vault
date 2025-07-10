import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  userType: "job_seeker" | "employer" | "university" | "admin";
}

class AuthService {
  async login({ email, password }: LoginCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { user: null, error: error.message, isAdmin: false };
      }

      // Check if user is admin
      const isAdmin = await this.checkAdminStatus(data.user?.id);

      console.log("Login successful:", data.user?.id, "isAdmin:", isAdmin);
      return { user: data.user, error: null, isAdmin };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        user: null,
        error: "An unexpected error occurred during login.",
        isAdmin: false,
      };
    }
  }

  async checkAdminStatus(userId?: string) {
    if (!userId) return false;

    try {
      // Get user from users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", userId)
        .single();

      if (userError || !userData) {
        return false;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.id)
        .eq("role", "admin")
        .single();

      return !roleError && !!roleData;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  }

  async register({ email, password, fullName, userType }: RegisterCredentials) {
    try {
      console.log("====");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          },
        },
      });
      console.log("signup data save", data);
      if (error) {
        console.error("Registration error:", error);
        return { user: null, error: error.message };
      }

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user, fullName, userType);
      }

      console.log("Registration successful:", data.user?.id);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        user: null,
        error: "An unexpected error occurred during registration.",
      };
    }
  }

  async createUserProfile(user: User, fullName: string, userType: string) {
    try {
      // Use upsert to handle cases where profile might already exist
      const { error } = await supabase.from("users").upsert(
        [
          {
            auth_id: user.id,
            email: user.email || "",
            full_name: fullName,
            user_type: userType,
          },
        ],
        {
          onConflict: "auth_id",
        }
      );

      if (error) {
        console.error("Error creating user profile:", error);
      } else {
        console.log("User profile created successfully");
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      // Use maybeSingle() to handle potential duplicates
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile } = await supabase
          .from("users")
          .insert({
            auth_id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            user_type: "admin",
          })
          .select()
          .single();

        return newProfile;
      }

      return profile;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        return { error: error.message };
      }
      console.log("Logout successful");
      return { error: null };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { error: "An unexpected error occurred during logout." };
    }
  }
}

export const authService = new AuthService();
