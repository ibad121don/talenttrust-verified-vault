import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mail, 
  Phone, 
  MapPin, 
  Home,
  Info,
  Briefcase,
  Lock,
  FileText,
  Shield,
  Eye,
  Globe,
  Accessibility,
  ArrowUp,
  Copyright,
  Send
} from "lucide-react";

const HomeFooter = () => {
  const [email, setEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle newsletter signup
  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter signup:", email);
      // Here you would integrate with your newsletter service
      alert("Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  // Handle back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide back to top button based on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8 mb-12">
            
            {/* Brand/Logo & Brief Description */}
            <div className="xl:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" 
                  alt="TrustTalent Logo" 
                  className="h-10 w-10" 
                />
                <span className="text-2xl font-bold">TrustTalent</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Connecting verified talent with trusted employers through secure document verification 
                and professional networking. Building trust in the digital recruitment landscape.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4 pt-2">
                <a 
                  href="https://facebook.com/trusttalent" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/trusttalent" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/trusttalent" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/trusttalent" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://youtube.com/trusttalent" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>About Us</span>
                  </a>
                </li>
                <li>
                  <a href="/jobs" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Find Jobs</span>
                  </a>
                </li>
                <li>
                  <a href="/vault" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Document Vault</span>
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Pricing</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Legal & Compliance</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Terms & Conditions</span>
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Cookie Policy</span>
                  </a>
                </li>
                <li>
                  <a href="/gdpr" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>GDPR Compliance</span>
                  </a>
                </li>
                <li>
                  <a href="/accessibility" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2">
                    <Accessibility className="h-4 w-4" />
                    <span>Accessibility Statement</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact Information</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300 text-sm">
                    <p>TrustTalent Ltd</p>
                    <p>123 Innovation Street</p>
                    <p>London EC2A 4DP</p>
                    <p>United Kingdom</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a 
                    href="tel:+442071234567" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    +44 20 7123 4567
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a 
                    href="mailto:hello@trusttalent.com" 
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    hello@trusttalent.com
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter Signup & Controls */}
            <div className="space-y-6">
              {/* Newsletter Signup */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Stay Updated</span>
                </h3>
                <p className="text-gray-300 text-sm">
                  Subscribe to our newsletter for the latest job opportunities and platform updates.
                </p>
                <form onSubmit={handleNewsletterSignup} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </form>
              </div>

              {/* Language & Accessibility Controls */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Preferences</span>
                </h4>
                <div className="space-y-2">
                  <Select defaultValue="en-GB">
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-gray-300 border-gray-700 hover:bg-gray-800"
                  >
                    <Accessibility className="h-4 w-4 mr-2" />
                    Accessibility Options
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Copyright className="h-4 w-4" />
                <span>© 2025 TrustTalent Ltd. All rights reserved.</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-end space-x-6 text-sm">
                <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </a>
                <a href="/security" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Centre
                </a>
                <span className="text-gray-500">
                  Powered by TrustTalent Engine
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 rounded-full p-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default HomeFooter;
