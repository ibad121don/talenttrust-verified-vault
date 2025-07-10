import { supabase } from "@/integrations/supabase/client";

export const userProfileService = {
  async fetchUserProfile(userId: string) {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path === "/" || path === "/register") {
        console.log("Skipping profile fetch on", path);
        return null;
      }
    }

    console.log("Fetching user profile for:", userId);

    try {
      // Step 1: Check if profile already exists
      const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .single();

      if (profile) {
        console.log("User profile exists:", profile);
        return profile;
      }

      if (error && error.code !== "PGRST116") {
        console.error("Error checking user profile:", error);
        return null;
      }

      // Step 2: Get authenticated user info
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user || !user.email) {
        console.error("User not authenticated or missing email");
        throw new Error("Please verify your account");
      }

      // ✅ Step 3: Check if email is verified
      const isEmailVerified =
        user.email_confirmed_at ||
        user.confirmed_at ||
        user.confirmation_sent_at;

      if (!isEmailVerified) {
        console.warn("Email not verified for:", user.email);
        throw new Error("Please verify your account");
      }

      // Step 4: Create new profile
      const { data: newProfile, error: insertError } = await supabase
        .from("users")
        .insert({
          auth_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          user_type: user.user_metadata?.user_type || "",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        return null;
      }

      console.log("User profile created:", newProfile);
      return newProfile;
    } catch (error: any) {
      console.error("Error in fetchUserProfile:", error.message || error);
      throw error;
    }
  },
};
