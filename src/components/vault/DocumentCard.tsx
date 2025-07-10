
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  Download,
  Share,
  Trash2,
  Shield,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { Document } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const { toast } = useToast();
  const { requestVerification, deleteDocument } = useDocuments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "failed": return "text-red-600 bg-red-100";
      case "uploaded": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "failed": return <AlertTriangle className="h-4 w-4" />;
      case "uploaded": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "degree": return "bg-blue-100 text-blue-700";
      case "certificate": return "bg-purple-100 text-purple-700";
      case "license": return "bg-orange-100 text-orange-700";
      case "reference": return "bg-green-100 text-green-700";
      case "work_sample": return "bg-pink-100 text-pink-700";
      case "cv_resume": return "bg-indigo-100 text-indigo-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleDownloadDocument = async () => {
    try {
      if (!document.file_url) {
        toast({
          title: "Error",
          description: "File URL not available for download",
          variant: "destructive"
        });
        return;
      }

      // Extract the file path from the URL
      const url = new URL(document.file_url);
      const pathSegments = url.pathname.split('/');
      const filePath = pathSegments.slice(-2).join('/'); // Get the last two segments (folder/filename)

      // Download the file from Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_documents')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: "Download Failed",
          description: "Unable to download the document. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create blob URL and trigger download
      const blob = new Blob([data], { type: document.file_type || 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);
      
      const link = window.document.createElement('a');
      link.href = blobUrl;
      link.download = document.name || 'document';
      
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);

      toast({
        title: "Download Started",
        description: "Your document download has begun",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyDocument = async () => {
    try {
      await requestVerification(document.id, 'ai_analysis');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleShareDocument = async () => {
    try {
      // Generate a shareable link for the document portfolio
      const shareUrl = `${window.location.origin}/portfolio/${document.user_id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Portfolio Link Copied",
        description: "Your portfolio link has been copied to clipboard. Share it with potential employers!",
      });
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Share Failed",
        description: "Unable to copy portfolio link. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await deleteDocument(document.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getVerificationScore = () => {
    // Mock verification score calculation based on status
    if (document.status === "verified") return Math.floor(Math.random() * 20) + 80;
    return null;
  };

  const verificationScore = getVerificationScore();

  return (
    <div className="border rounded-lg p-4 sm:p-6 hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div className={`p-2 sm:p-3 rounded-lg ${getStatusColor(document.status)} flex-shrink-0`}>
            {getStatusIcon(document.status)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate pr-2">{document.name}</h3>
            <p className="text-sm sm:text-base text-gray-600 truncate pr-2">{document.issuer}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={`${getTypeColor(document.type)} text-xs`}>
                {document.type.replace('_', ' ')}
              </Badge>
              <Badge className={`${getStatusColor(document.status)} text-xs`}>
                {document.status}
              </Badge>
              {verificationScore && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {verificationScore}% verified
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Button variant="outline" size="sm" onClick={handleDownloadDocument} className="text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          {document.status === "verified" && (
            <Button variant="outline" size="sm" onClick={handleShareDocument} className="text-xs sm:text-sm">
              <Share className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          )}
          {(document.status === "uploaded" || document.status === "failed") && (
            <Button 
              size="sm" 
              onClick={handleVerifyDocument}
              className="text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden lg:inline">Verify with TrustTalent</span>
              <span className="lg:hidden">Verify</span>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleDeleteDocument} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
        <div>
          <span className="font-medium">Uploaded:</span> {new Date(document.upload_date).toLocaleDateString()}
        </div>
        {document.expiry_date && (
          <div>
            <span className="font-medium">Expires:</span> {new Date(document.expiry_date).toLocaleDateString()}
          </div>
        )}
        <div>
          <span className="font-medium">Privacy:</span> {document.privacy}
        </div>
        {document.status === "verified" && (
          <div>
            <span className="font-medium">Verification Date:</span> {new Date().toLocaleDateString()}
          </div>
        )}
      </div>
      
      {document.status === "failed" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs sm:text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Verification failed. The document could not be verified with the issuing institution. 
            Please check the document quality and try again.
          </p>
        </div>
      )}
      
      {document.status === "pending" && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm text-yellow-700">
            <Clock className="h-4 w-4 inline mr-2" />
            Verification in progress. TrustTalent AI is currently verifying this document. 
            You'll be notified when complete.
          </p>
        </div>
      )}

      {document.status === "uploaded" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-700">
            <Zap className="h-4 w-4 inline mr-2" />
            Ready for verification. Click "Verify with TrustTalent" to start AI-powered credential verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
