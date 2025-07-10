
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Lock } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const GDPR = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
            <p className="text-xl text-gray-600">Your data protection rights under GDPR</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Right to access</h4>
                  <p className="text-gray-600">You have the right to request copies of your personal data.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Right to rectification</h4>
                  <p className="text-gray-600">You have the right to request correction of inaccurate personal data.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Right to erasure</h4>
                  <p className="text-gray-600">You have the right to request deletion of your personal data.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Right to data portability</h4>
                  <p className="text-gray-600">You have the right to request transfer of your data to another service.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>How we protect your data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organisational measures to ensure a level 
                of security appropriate to the risk, including encryption, access controls, and 
                regular security assessments.
              </p>
              <p className="text-gray-600">
                Our data processing activities are conducted in accordance with GDPR principles 
                of lawfulness, fairness, transparency, purpose limitation, data minimisation, 
                accuracy, storage limitation, integrity, and confidentiality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Contact our Data Protection Officer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about our GDPR compliance or wish to exercise your rights, 
                please contact our Data Protection Officer at: 
                <a href="mailto:dpo@trusttalent.com" className="text-blue-600 hover:underline ml-1">
                  dpo@trusttalent.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default GDPR;
