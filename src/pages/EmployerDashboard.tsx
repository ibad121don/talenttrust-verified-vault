import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Search,
  Building,
  User,
  Bell,
  MapPin,
  Plus,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [jobPostStats, setJobPostStats] = useState({
    totalPosts: 5,
    activePosts: 3,
    inactivePosts: 2,
  });
  const [applicantStats, setApplicantStats] = useState({
    totalApplicants: 120,
    newApplicants: 20,
    shortlisted: 30,
  });
  const [companyProfile, setCompanyProfile] = useState({
    name: "Acme Corp",
    industry: "Technology",
    location: "San Francisco, CA",
  });
  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Career Fair", date: "2024-03-15" },
    { id: 2, title: "Webinar", date: "2024-04-01" },
  ]);

  useEffect(() => {
    // Simulate fetching data from an API
    // Replace with actual API calls
    if (userProfile) {
      // Fetch job post stats
      // Fetch applicant stats
      // Fetch company profile
      // Fetch upcoming events
    }
  }, [userProfile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-6 w-6" />
              <span className="text-xl font-bold text-gray-900">TrustTalent</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" onClick={() => navigate("/dashboard/employer")}>Dashboard</Button>
              <Button variant="ghost" onClick={() => navigate("/jobs")}>Find Talent</Button>
              <Button variant="ghost" onClick={() => navigate("/vault")}>My Vault</Button>
              <Button variant="ghost" onClick={() => navigate("/messages")}>Messages</Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/post-job")} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/notifications")}>
              <span className="sr-only">Notifications</span>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="font-medium">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
            <p className="text-gray-600">Welcome back! Manage your job postings and find top talent.</p>
          </div>
          <Button onClick={() => navigate("/post-job")} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Briefcase className="h-5 w-5 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/post-job")}
          >
            <Plus className="h-6 w-6" />
            <span>Post Job</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/jobs")}
          >
            <Search className="h-6 w-6" />
            <span>Find Talent</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/messages")}
          >
            <Users className="h-6 w-6" />
            <span>Messages</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col space-y-2"
            onClick={() => navigate("/vault")}
          >
            <FileText className="h-6 w-6" />
            <span>Documents</span>
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Job Post Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Job Post Statistics</CardTitle>
              <CardDescription>Overview of your job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Posts</span>
                <Badge>{jobPostStats.totalPosts}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Posts</span>
                <Badge variant="secondary">{jobPostStats.activePosts}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Inactive Posts</span>
                <Badge variant="outline">{jobPostStats.inactivePosts}</Badge>
              </div>
              <Button variant="link" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View All Posts
              </Button>
            </CardContent>
          </Card>

          {/* Applicant Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Statistics</CardTitle>
              <CardDescription>Track your applicant pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Applicants</span>
                <Badge>{applicantStats.totalApplicants}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>New Applicants</span>
                <Badge variant="secondary">{applicantStats.newApplicants}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Shortlisted</span>
                <Badge variant="outline">{applicantStats.shortlisted}</Badge>
              </div>
              <Button variant="link" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Applicants
              </Button>
            </CardContent>
          </Card>

          {/* Company Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Your company's public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{companyProfile.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <span>{companyProfile.industry}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{companyProfile.location}</span>
                </div>
              </div>
              <Button variant="link" className="justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1 inline-block" />
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
