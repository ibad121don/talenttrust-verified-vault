
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import DocumentCard from "./DocumentCard";
import UploadDialog from "./UploadDialog";
import { Document } from "@/types/documents";

interface DocumentListProps {
  documents: Document[];
  filteredDocuments: Document[];
  searchTerm: string;
  filterType: string;
  filterStatus: string;
}

const DocumentList = ({ documents, filteredDocuments, searchTerm, filterType, filterStatus }: DocumentListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Your Documents</CardTitle>
        <CardDescription>
          {filteredDocuments.length} of {documents.length} documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
          
          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
                {searchTerm || filterType !== "all" || filterStatus !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Upload your first document to get started with verification"
                }
              </p>
              {!searchTerm && filterType === "all" && filterStatus === "all" && (
                <UploadDialog />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
