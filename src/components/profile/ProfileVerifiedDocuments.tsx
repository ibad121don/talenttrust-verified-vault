import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, User } from "lucide-react";
import { Document } from "@/types/documents";

const LOCAL_KEY = "verified_documents";

interface ProfileVerifiedDocumentsProps {
  profileData: {
    firstName?: string;
    lastName?: string;
  };
}

const ProfileVerifiedDocuments = ({
  profileData,
}: ProfileVerifiedDocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const docs = localStorage.getItem(LOCAL_KEY);
    if (docs) {
      setDocuments(JSON.parse(docs));
    }
  }, []);

  const handleDownload = (doc: Document) => {
    window.open(doc.file_url, "_blank");
  };

  const userFullName =
    [profileData?.firstName, profileData?.lastName].filter(Boolean).join(" ") ||
    "Unknown User";

  return (
    <Card className="mt-6 shadow-lg border-blue-100">
      <CardHeader className="bg-blue-50 rounded-t-md">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>My Verified Documents (Local)</span>
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          These are your verified documents saved locally from the shared
          portfolio page.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No verified documents saved locally.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col md:flex-row md:items-center md:space-x-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0 mb-2 md:mb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-700 font-semibold">
                      {userFullName}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <Badge className="bg-blue-100 text-blue-700 mt-1">
                    {doc.type}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline text-xs"
                  >
                    View <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center text-green-600 hover:underline text-xs ml-2"
                    title="Download"
                  >
                    <Download className="h-4 w-4 mr-1" /> Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileVerifiedDocuments;
