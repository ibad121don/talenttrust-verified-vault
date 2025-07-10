
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BackButton } from "@/components/auth/BackButton";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { RegistrationTabs } from "@/components/auth/RegistrationTabs";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const defaultRole = searchParams.get("role") || "seeker";
  
  const [activeTab, setActiveTab] = useState(defaultRole);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    company: "",
    universityName: "",
    accreditationId: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (!formData.fullName.trim()) {
      toast({
        title: "Error", 
        description: "Full name is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Map activeTab to userType
      const userTypeMap = {
        seeker: 'job_seeker',
        employer: 'employer', 
        university: 'university',
        admin: 'job_seeker' // Default fallback
      };

      const { error } = await register(
        formData.email, 
        formData.password, 
        formData.fullName,
        userTypeMap[activeTab as keyof typeof userTypeMap]
      );

      if (error) {
        toast({
          title: "Registration Failed",
          description: error,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Account Created Successfully!",
        description: "Please check your email inbox and click the verification link before you can sign in. You may need to check your spam folder.",
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-12">
      <BackButton 
        onClick={() => navigate("/")}
        text="Back to Home"
      />

      <div className="container mx-auto px-4">
        <LoginHeader
          logoSrc="/lovable-uploads/1d72e634-c5ad-4e01-a22a-2cc0c4eac5c5.png"
          title="Create Your Account"
          subtitle="Join the verified talent revolution"
        />

        {/* Registration Form */}
        <div className="max-w-md mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Choose your account type and get started</CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                    Sign in
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
