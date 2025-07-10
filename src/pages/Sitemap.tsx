
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/auth/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Home, User, Briefcase, Shield, FileText } from "lucide-react";
import HomeFooter from "@/components/home/HomeFooter";

const Sitemap = () => {
  const navigate = useNavigate();

  const siteLinks = {
    "Main Pages": [
      { name: "Home", path: "/", icon: Home },
      { name: "About Us", path: "/about", icon: User },
      { name: "Find Jobs", path: "/jobs", icon: Briefcase },
      { name: "Pricing", path: "/pricing", icon: FileText },
      { name: "Help Centre", path: "/help", icon: FileText },
    ],
    "User Account": [
      { name: "Login", path: "/login", icon: User },
      { name: "Register", path: "/register", icon: User },
      { name: "Profile", path: "/profile", icon: User },
      { name: "Dashboard", path: "/dashboard/seeker", icon: Home },
      { name: "Document Vault", path: "/vault", icon: Shield },
      { name: "Messages", path: "/messages", icon: FileText },
      { name: "Notifications", path: "/notifications", icon: FileText },
    ],
    "Legal & Compliance": [
      { name: "Privacy Policy", path: "/privacy", icon: Shield },
      { name: "Terms & Conditions", path: "/terms", icon: FileText },
      { name: "Cookie Policy", path: "/cookies", icon: FileText },
      { name: "GDPR Compliance", path: "/gdpr", icon: Shield },
      { name: "Accessibility Statement", path: "/accessibility", icon: FileText },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <BackButton onClick={() => navigate(-1)} text="Back" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Map className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
            <p className="text-xl text-gray-600">Find your way around TrustTalent</p>
          </div>

          <div className="space-y-8">
            {Object.entries(siteLinks).map(([category, links]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle>{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {links.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <a
                          key={link.path}
                          href={link.path}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700 hover:text-blue-600">{link.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Sitemap;
