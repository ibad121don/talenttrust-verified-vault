import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { LoginFooter } from "@/components/auth/LoginFooter";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { BackButton } from "@/components/auth/BackButton";
import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { userProfileService } from "@/services/userProfileService";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user, loading } = useAuth();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const logoSrc = "/lovable-uploads/353f8749-04ef-4886-91d8-8fd0ad698158.png";

  // Add debugging
  useEffect(() => {
    console.log(
      "Login component - loading:",
      loading,
      "user:",
      user?.id || "no user"
    );
    if (user != null) {
      // logout();
    }
  }, []);

  // Handle user login redirect with proper admin check
  // useEffect(() => {
  //   const handleUserRedirect = async () => {
  //     if (user && !loading) {
  //       console.log('User logged in, checking admin status...');

  //       try {
  //         // Get user from users table
  //         const { data: userData, error: userError } = await supabase
  //           .from('users')
  //           .select('id')
  //           .eq('auth_id', user.id)
  //           .single();

  //         // if (userError || !userData) {
  //         //   console.log('User not found in users table:', userError);
  //         //   navigate("/dashboard/seeker");
  //         //   return;
  //         // }

  //         console.log('Found user in users table:', userData.id);

  //         // Check if user has admin role
  //         const { data: roleData, error: roleError } = await supabase
  //           .from('user_roles')
  //           .select('role')
  //           .eq('user_id', userData.id)
  //           .eq('role', 'admin')
  //           .single();

  //         const isAdmin = !roleError && !!roleData;
  //         console.log('Admin role check result:', isAdmin, roleError);

  //         if (isAdmin) {
  //           console.log('Admin user detected, redirecting to admin dashboard');
  //           navigate("/admin");
  //         } else {
  //           console.log('Regular user, redirecting to seeker dashboard');
  //           navigate("/dashboard/seeker");
  //         }
  //       } catch (error) {
  //         console.error('Error during admin check:', error);
  //         navigate("/dashboard/seeker");
  //       }
  //     }
  //   };

  //   handleUserRedirect();
  // }, [user, loading, navigate]);

  // Show loading screen only during initial auth check
  if (loading) {
    console.log("Showing loading screen");
    return <LoadingScreen logoSrc={logoSrc} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.error) {
        setError(result.error);

        // Show specific error messages for common issues
        if (result.error.includes("Invalid login credentials")) {
          setError(
            "Invalid email or password. Please check your credentials and try again."
          );
        } else if (result.error.includes("too many")) {
          setError(
            "Too many login attempts. Please wait 15 minutes before trying again."
          );
        } else if (result.error.includes("Email not confirmed")) {
          setError(
            "Please check your email and click the confirmation link before signing in."
          );
        }
      } else {
        var profile = await userProfileService.fetchUserProfile(result.user.id);
        if (profile == null) {
          await userProfileService.createProfile();
          profile = await userProfileService.fetchUserProfile(result.user.id);
        }
        await localStorage.setItem("userprofile", JSON.stringify(profile));
        if (profile.user_type == "admin") {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/admin");
        } else {
          console.log("Regular user, redirecting to seeker dashboard");
          navigate("/dashboard/seeker");
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });

        // The useEffect above will handle the redirect based on admin status
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resetEmail) {
      setError("Please enter your email address.");
      return;
    }

    setIsResetting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Password reset email sent",
          description:
            "Please check your email for password reset instructions.",
        });
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear error when user starts typing
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForgotPasswordCancel = () => {
    setShowForgotPassword(false);
    setResetEmail("");
    setError(null);
  };

  console.log("Rendering login form");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BackButton onClick={() => navigate("/")} text="Back to Home" />

      <div className="flex items-center justify-center min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <LoginHeader
              logoSrc={logoSrc}
              title="Welcome Back"
              subtitle="Sign in to your verified account"
            />

            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>
                  {showForgotPassword ? "Reset Password" : "Sign In"}
                </CardTitle>
                <CardDescription>
                  {showForgotPassword
                    ? "Enter your email to receive password reset instructions"
                    : "Enter your credentials to access your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {showForgotPassword ? (
                  <ForgotPasswordForm
                    resetEmail={resetEmail}
                    isResetting={isResetting}
                    onEmailChange={setResetEmail}
                    onSubmit={handleForgotPassword}
                    onCancel={handleForgotPasswordCancel}
                  />
                ) : (
                  <LoginForm
                    formData={formData}
                    isLoading={isLoading}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                  />
                )}

                <LoginFooter
                  showForgotPassword={showForgotPassword}
                  onForgotPasswordClick={() => setShowForgotPassword(true)}
                  onRegisterClick={() => navigate("/register")}
                />

                <SecurityNotice logoSrc={logoSrc} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
