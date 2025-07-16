import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, ExternalLink, Download, User } from "lucide-react";
import { publicPortfolioService } from "@/services/publicPortfolioService";
import { profileService } from "@/services/profileService";
import { Document } from "@/types/documents";

const Portfolio = () => {
  const { portfolioId } = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string>("");
  const [profileName, setProfileName] = useState<string>("");

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true);
      setError(null);
      try {
        const docs =
          await publicPortfolioService.fetchVerifiedDocumentsByPortfolioId(
            portfolioId || ""
          );
        setDocuments(docs);
        // Try to get the user's full name from the first document's metadata or issuer fields
        if (docs.length > 0) {
          const meta = docs[0].metadata || {};
          let fullName =
            meta.full_name ||
            meta.fullName ||
            meta.name ||
            docs[0].issuer ||
            "Unknown User";
          setUserFullName(fullName);

          // Fetch the profile name of the user who created this portfolio
          const userId = docs[0].user_id;
          try {
            const { profile } = await profileService.getProfile(userId);
            setProfileName(profile?.full_name || "");
          } catch (e) {
            setProfileName("");
          }
        } else {
          setUserFullName("");
          setProfileName("");
        }
      } catch (err: any) {
        setError(
          err?.message || JSON.stringify(err) || "Failed to load documents."
        );
      } finally {
        setLoading(false);
      }
    };
    if (portfolioId) fetchDocs();
  }, [portfolioId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-blue-100">
        <CardHeader className="bg-blue-50 rounded-t-md">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Shared Portfolio</span>
          </CardTitle>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-800 text-sm">
                {profileName || userFullName || "Unknown User"}
              </span>
            </div>
            <span className="text-xs text-gray-600 mt-1 md:mt-0">
              Portfolio ID: <Badge variant="outline">{portfolioId}</Badge>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading verified documents...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-medium">Verified Documents</span>
                <Badge variant="outline">{documents.length} documents</Badge>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {documents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No verified documents found for this portfolio.</p>
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
                          <span className="text-xs text-blue-700 font-semibold">
                            {profileName || userFullName || "Unknown User"}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate">
                          {doc.name}
                        </p>
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
                          onClick={async () => {
                            try {
                              const response = await fetch(doc.file_url, {
                                mode: "cors",
                              });
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = doc.name || "document";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                            } catch (e) {
                              alert("Failed to download file.");
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ml-2"
                          title="Download"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
