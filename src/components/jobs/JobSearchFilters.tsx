
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Filter } from "lucide-react";

interface JobSearchFiltersProps {
  searchTerm: string;
  location: string;
  jobType: string;
  verificationRequired: string;
  onSearchTermChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
  onVerificationRequiredChange: (value: string) => void;
}

const JobSearchFilters = ({
  searchTerm,
  location,
  jobType,
  verificationRequired,
  onSearchTermChange,
  onLocationChange,
  onJobTypeChange,
  onVerificationRequiredChange
}: JobSearchFiltersProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Search & Filter Jobs</CardTitle>
        <CardDescription>Use the filters below to find the perfect role for you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Location..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={jobType} onValueChange={onJobTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verificationRequired} onValueChange={onVerificationRequiredChange}>
            <SelectTrigger>
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="required">Verification Required</SelectItem>
              <SelectItem value="not-required">No Verification Required</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSearchFilters;
