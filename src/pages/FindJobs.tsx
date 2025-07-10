import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, DollarSign, Bookmark, Filter } from "lucide-react";
import JobsHeader from "@/components/jobs/JobsHeader";
import JobSearchFilters from "@/components/jobs/JobSearchFilters";
import JobList from "@/components/jobs/JobList";
import HomeFooter from "@/components/home/HomeFooter";

// Mock job data for demonstration
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Ltd",
    location: "London, UK",
    type: "Permanent",
    salary: "£60,000 - £80,000",
    posted: "2 days ago",
    description: "We're looking for an experienced Frontend Developer to join our growing team...",
    requirements: ["React", "TypeScript", "CSS", "Git"],
    verificationRequired: true,
    saved: false
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupX",
    location: "Manchester, UK",
    type: "Contract",
    salary: "£450 - £550/day",
    posted: "1 week ago",
    description: "Join our dynamic startup as a Full Stack Engineer working on cutting-edge projects...",
    requirements: ["Node.js", "React", "PostgreSQL", "AWS"],
    verificationRequired: false,
    saved: true
  }
];

const FindJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [verificationRequired, setVerificationRequired] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setJobType("all");
    setVerificationRequired("all");
  };

  // Filter jobs based on search criteria
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = location === "" || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    const matchesType = jobType === "all" || job.type.toLowerCase() === jobType.toLowerCase();
    
    const matchesVerification = verificationRequired === "all" ||
      (verificationRequired === "required" && job.verificationRequired) ||
      (verificationRequired === "not-required" && !job.verificationRequired);
    
    return matchesSearch && matchesLocation && matchesType && matchesVerification;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <JobsHeader />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover jobs that match your verified skills and experience</p>
        </div>

        {/* Search Section */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search jobs, skills, or companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
                <Button className="w-full sm:w-auto">
                  <Search className="h-4 w-4 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <JobSearchFilters 
              searchTerm={searchQuery}
              location={location}
              jobType={jobType}
              verificationRequired={verificationRequired}
              onSearchTermChange={setSearchQuery}
              onLocationChange={setLocation}
              onJobTypeChange={setJobType}
              onVerificationRequiredChange={setVerificationRequired}
            />
          </div>

          {/* Job Results */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Job Results</h2>
                <p className="text-sm text-gray-600">{filteredJobs.length} jobs found</p>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Sort by:</span>
                <Button variant="ghost" size="sm" className="text-xs">Relevance</Button>
                <Button variant="ghost" size="sm" className="text-xs">Date</Button>
                <Button variant="ghost" size="sm" className="text-xs">Salary</Button>
              </div>
            </div>

            <JobList jobs={filteredJobs} onClearFilters={handleClearFilters} />
          </div>
        </div>
      </div>
      
      <HomeFooter />
    </div>
  );
};

export default FindJobs;
