
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Server, AlertTriangle } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const Security = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Security</h1>
            <p className="text-xl text-gray-600">Protecting your data and privacy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-green-600" />
                  <span>Data Encryption</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All data is encrypted in transit using TLS 1.3 and at rest using 
                  AES-256 encryption to ensure maximum security.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-6 w-6 text-blue-600" />
                  <span>Secure Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our infrastructure is hosted on secure, ISO 27001 certified 
                  servers with regular security audits and monitoring.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Access Controls</h4>
                  <p className="text-gray-600">Strict access controls ensure only authorised personnel can access your data.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Minimisation</h4>
                  <p className="text-gray-600">We only collect and process data that is necessary for our services.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Regular Audits</h4>
                  <p className="text-gray-600">Regular security audits and penetration testing ensure our systems remain secure.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Report a Security Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                If you discover a security vulnerability, please report it to us immediately. 
                We take all security reports seriously and will investigate promptly.
              </p>
              <p className="text-gray-600">
                Contact our security team at: 
                <a href="mailto:security@trusttalent.com" className="text-blue-600 hover:underline ml-1">
                  security@trusttalent.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                TrustTalent maintains compliance with industry standards including ISO 27001, 
                SOC 2 Type II, and GDPR requirements to ensure the highest level of security 
                and data protection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Security;
