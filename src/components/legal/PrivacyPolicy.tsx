
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-GB')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Your Data Rights Under GDPR
          </CardTitle>
          <CardDescription>
            We are committed to protecting your privacy and ensuring compliance with GDPR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Right to Access</h4>
              <p className="text-sm text-muted-foreground">
                You can request a copy of all personal data we hold about you
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Right to Rectification</h4>
              <p className="text-sm text-muted-foreground">
                You can request corrections to inaccurate or incomplete data
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Right to Erasure</h4>
              <p className="text-sm text-muted-foreground">
                You can request deletion of your personal data ("right to be forgotten")
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Right to Portability</h4>
              <p className="text-sm text-muted-foreground">
                You can request your data in a machine-readable format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="h-96 w-full">
        <div className="space-y-6 pr-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Name, email address, and contact details</li>
                  <li>• Professional qualifications and work history</li>
                  <li>• Educational credentials and certifications</li>
                  <li>• Identity verification documents</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• IP address and location data</li>
                  <li>• Device information and browser type</li>
                  <li>• Usage patterns and session information</li>
                  <li>• Security logs and audit trails</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                How We Protect Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Encryption</h4>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. 
                  Your documents and personal information are encrypted before storage.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Access Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Strict role-based access control ensures only authorised personnel can access your data. 
                  Multi-factor authentication is required for all administrative access.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Security Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  We continuously monitor for suspicious activity and maintain detailed audit logs. 
                  Security events are tracked and investigated promptly.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Verify your identity and credentials</li>
                  <li>• Match you with relevant job opportunities</li>
                  <li>• Provide secure document storage</li>
                  <li>• Facilitate communication with employers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Legal Compliance</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Comply with legal and regulatory requirements</li>
                  <li>• Prevent fraud and protect security</li>
                  <li>• Maintain audit trails for compliance</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We retain your personal data only for as long as necessary to provide our services 
                and comply with legal obligations:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Account data: Retained while your account is active</li>
                <li>• Document verification history: 7 years for compliance</li>
                <li>• Security logs: 2 years for security monitoring</li>
                <li>• Anonymised analytics: May be retained indefinitely</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For any privacy-related questions or to exercise your data rights, please contact:
              </p>
              <div className="text-sm">
                <p><strong>Data Protection Officer</strong></p>
                <p>Email: privacy@trusttalent.com</p>
                <p>Address: TrustTalent Ltd, Privacy Office, London, UK</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy;
