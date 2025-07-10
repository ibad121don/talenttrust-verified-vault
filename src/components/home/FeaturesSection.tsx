
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, FileText, CheckCircle } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Why TrustTalent?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="border-blue-100 hover:border-blue-200 transition-colors">
          <CardHeader>
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>AI-Powered Verification</CardTitle>
            <CardDescription>
              Our TalentTrust Engine verifies degrees, certificates, licences, and work samples with 99.7% accuracy
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-green-100 hover:border-green-200 transition-colors">
          <CardHeader>
            <FileText className="h-12 w-12 text-green-600 mb-4" />
            <CardTitle>Secure Document Vault</CardTitle>
            <CardDescription>
              Store, organise, and share verified credentials securely. One-click application attachments
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-purple-100 hover:border-purple-200 transition-colors">
          <CardHeader>
            <CheckCircle className="h-12 w-12 text-purple-600 mb-4" />
            <CardTitle>Trusted by Top Organisations</CardTitle>
            <CardDescription>
              Join thousands of employers and universities using verified credential data to make better decisions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};

export default FeaturesSection;
