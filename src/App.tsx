import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";
import DocumentVault from "./pages/DocumentVault";
import FindJobs from "./pages/FindJobs";
import PostJob from "./pages/PostJob";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import PricingPage from "./pages/PricingPage";
import Admin from "./pages/Admin";
import Network from "./pages/Network";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Cookies from "./pages/Cookies";
import GDPR from "./pages/GDPR";
import Accessibility from "./pages/Accessibility";
import Sitemap from "./pages/Sitemap";
import Security from "./pages/Security";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import HelpCenter from "./pages/HelpCenter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            <Route path="/dashboard/university" element={<UniversityDashboard />} />
            <Route path="/vault" element={<DocumentVault />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/network" element={<Network />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/security" element={<Security />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
