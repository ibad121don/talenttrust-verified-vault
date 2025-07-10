
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  MapPin, 
  Clock, 
  PoundSterling, 
  Shield, 
  BookmarkPlus,
  Heart
} from "lucide-react";

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

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {job.title}
              </h3>
              {job.verificationRequired && (
                <Badge className="bg-green-100 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Verification Required
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{job.posted}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="outline">{job.type}</Badge>
              <div className="flex items-center space-x-1 text-green-600 font-medium">
                <PoundSterling className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{job.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.map((req, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {req}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button size="sm" variant={job.saved ? "default" : "outline"}>
              {job.saved ? <Heart className="h-4 w-4 mr-2 fill-current" /> : <BookmarkPlus className="h-4 w-4 mr-2" />}
              {job.saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">View Details</Button>
            <Button size="sm" variant="outline">Company Profile</Button>
          </div>
          <Button size="sm">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
