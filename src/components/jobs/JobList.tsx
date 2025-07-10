
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import JobCard from "./JobCard";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  verificationRequired: boolean;
  saved: boolean;
}

interface JobListProps {
  jobs: Job[];
  onClearFilters: () => void;
}

const JobList = ({ jobs, onClearFilters }: JobListProps) => {
  return (
    <>
      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more opportunities
            </p>
            <Button variant="outline" onClick={onClearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default JobList;
