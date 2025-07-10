
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import UploadDialog from "./UploadDialog";

interface DocumentControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

const DocumentControls = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus
}: DocumentControlsProps) => {
  return (
    <Card className="mb-6 sm:mb-8">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="degree">Degrees</SelectItem>
                  <SelectItem value="certificate">Certificates</SelectItem>
                  <SelectItem value="license">Licenses</SelectItem>
                  <SelectItem value="reference">References</SelectItem>
                  <SelectItem value="work_sample">Work Samples</SelectItem>
                  <SelectItem value="cv_resume">CV/Resume</SelectItem>
                  <SelectItem value="transcript">Transcripts</SelectItem>
                  <SelectItem value="passport">Passports</SelectItem>
                  <SelectItem value="id_card">ID Cards</SelectItem>
                  <SelectItem value="birth_certificate">Birth Certificates</SelectItem>
                  <SelectItem value="marriage_certificate">Marriage Certificates</SelectItem>
                  <SelectItem value="bank_statement">Bank Statements</SelectItem>
                  <SelectItem value="insurance_document">Insurance Documents</SelectItem>
                  <SelectItem value="tax_document">Tax Documents</SelectItem>
                  <SelectItem value="medical_record">Medical Records</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Upload Button */}
          <div className="flex justify-center sm:justify-end">
            <UploadDialog />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentControls;
