
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Award, Target } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About TrustTalent</h1>
            <p className="text-xl text-gray-600">Revolutionising talent verification and recruitment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To build trust in the digital recruitment landscape by providing secure, 
                  verified credential verification and professional networking solutions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  <span>Our Values</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Trust, transparency, and innovation drive everything we do. We believe 
                  in empowering both job seekers and employers with verified information.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Founded in 2024, TrustTalent was born from the need to address growing concerns 
                about credential fraud in recruitment. Our AI-powered verification system helps 
                employers make confident hiring decisions whilst enabling job seekers to showcase 
                their verified qualifications and experience.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of users across the UK and beyond, connecting verified 
                talent with trusted employers through our innovative platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default About;
