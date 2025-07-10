
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const Cookies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Cookie className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-xl text-gray-600">How we use cookies on TrustTalent</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What are cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your computer or mobile device 
                when you visit our website. They help us provide you with a better experience 
                by remembering your preferences and enabling certain functionality.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Types of cookies we use</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential cookies</h4>
                  <p className="text-gray-600">Required for the website to function properly, including authentication and security.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance cookies</h4>
                  <p className="text-gray-600">Help us understand how visitors interact with our website by collecting anonymous information.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Functionality cookies</h4>
                  <p className="text-gray-600">Remember your preferences and provide enhanced features.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Managing cookies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You can control and manage cookies through your browser settings. Please note 
                that disabling essential cookies may affect the functionality of our website.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Cookies;
