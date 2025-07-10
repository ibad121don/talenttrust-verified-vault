
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Shield, Scale, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        <ScrollArea className="h-96 w-full">
          <div className="space-y-6 pr-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  By accessing and using TrustTalent's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  TrustTalent provides document verification and professional networking services including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Secure document storage and verification</li>
                  <li>• Job matching and application services</li>
                  <li>• Professional networking features</li>
                  <li>• Identity verification services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Account Security</h4>
                  <p className="text-sm text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Document Authenticity</h4>
                  <p className="text-sm text-muted-foreground">
                    You warrant that all documents uploaded are authentic, accurate, and legally obtained.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Prohibited Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Uploading fraudulent or falsified documents</li>
                  <li>• Misrepresenting your identity or qualifications</li>
                  <li>• Attempting to circumvent security measures</li>
                  <li>• Engaging in spam or harassment</li>
                  <li>• Violating applicable laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  TrustTalent's liability is limited to the maximum extent permitted by law. We are not liable for indirect, incidental, or consequential damages arising from your use of our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact:
                </p>
                <div className="text-sm">
                  <p><strong>Legal Department</strong></p>
                  <p>Email: legal@trusttalent.com</p>
                  <p>Address: TrustTalent Ltd, Legal Department, London, UK</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TermsOfService;
