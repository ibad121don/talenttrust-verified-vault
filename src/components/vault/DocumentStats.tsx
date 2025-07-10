
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Shield } from "lucide-react";
import { Document } from "@/types/documents";

interface DocumentStatsProps {
  documents: Document[];
}

const DocumentStats = ({ documents }: DocumentStatsProps) => {
  const verifiedDocs = documents.filter(doc => doc.status === "verified");
  const pendingDocs = documents.filter(doc => doc.status === "pending");
  
  // Calculate average score for verified documents (mock calculation)
  const avgScore = verifiedDocs.length > 0 
    ? Math.round(verifiedDocs.reduce((acc, doc) => {
        // Mock score based on verification status
        return acc + (Math.floor(Math.random() * 20) + 80);
      }, 0) / verifiedDocs.length)
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-green-600">Verified</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">{verifiedDocs.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-700">{pendingDocs.length}</p>
            </div>
            <Clock className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-600">Avg. Score</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-700">{avgScore}%</p>
            </div>
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentStats;
