
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accessibility as AccessibilityIcon, Monitor, Keyboard, Eye } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const Accessibility = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <AccessibilityIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
            <p className="text-xl text-gray-600">Our commitment to digital accessibility</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                TrustTalent is committed to ensuring digital accessibility for people with disabilities. 
                We are continually improving the user experience for everyone and applying the relevant 
                accessibility standards.
              </p>
              <p className="text-gray-600">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Keyboard className="h-5 w-5" />
                  <span>Keyboard Navigation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our website can be fully navigated using keyboard controls, 
                  with clear focus indicators and logical tab order.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Screen Reader Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We provide proper semantic markup and alternative text 
                  for images to ensure compatibility with screen readers.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Accessibility features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Visual accessibility</h4>
                  <p className="text-gray-600">High contrast ratios, scalable text, and clear visual hierarchy.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Motor accessibility</h4>
                  <p className="text-gray-600">Large click targets and keyboard-accessible interactive elements.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cognitive accessibility</h4>
                  <p className="text-gray-600">Clear navigation, consistent layout, and simple language.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you encounter any accessibility barriers on our website, please contact us at: 
                <a href="mailto:accessibility@trusttalent.com" className="text-blue-600 hover:underline ml-1">
                  accessibility@trusttalent.com
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

export default Accessibility;
