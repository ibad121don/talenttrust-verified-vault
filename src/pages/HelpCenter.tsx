import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, MessageSquare, FileText, Shield, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";

const HelpCenter = () => {
  const navigate = useNavigate();

  const faqItems = [
    {
      question: "How do I verify my documents?",
      answer: "Upload your documents to the Document Vault and our verification team will review them within 24-48 hours.",
      category: "Verification"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use AES-256 encryption and comply with GDPR regulations to protect your data.",
      category: "Security"
    },
    {
      question: "How does job matching work?",
      answer: "Our AI matches your verified skills and experience with relevant job opportunities from our partner employers.",
      category: "Jobs"
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, you can delete your account at any time from your profile settings. All data will be permanently removed.",
      category: "Account"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          </div>
          <p className="text-gray-600">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for help..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Document Verification</CardTitle>
              <CardDescription>Learn how to verify your credentials</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Job Applications</CardTitle>
              <CardDescription>Guide to applying for jobs</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Contact Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.answer}</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>Our support team is here to help you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Email: support@trusttalent.com</p>
              <p>Phone: +44 20 7123 4567</p>
              <p>Hours: Monday - Friday, 9 AM - 6 PM GMT</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpCenter;
