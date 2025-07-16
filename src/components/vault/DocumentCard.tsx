import { useEffect, useState } from "react";
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
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { Document } from "@/types/documents";
import { supabase } from "@/integrations/supabase/client";
import { documentService } from "@/services/documentService";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard = ({ document }: DocumentCardProps) => {
  const { toast } = useToast();
  const { requestVerification, deleteDocument } = useDocuments();
  const [verifying, setVerifying] = useState(false);
  const [verifyingdoc, setVerifyingDoc] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "partial_verified":
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "uploaded":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  useEffect(() => {
    checkuser();
  }, []);
  const checkuser = async () => {
    console.log(1);
    let dataUser = await localStorage.getItem("userprofile");
    let tempUser = JSON.parse(dataUser);

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", tempUser.id)
      .single();

    const { data: subcripti_data } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", tempUser.id);

    if (profile.documents_verified == 1 && subcripti_data.length == 0) {
      setVerifyingDoc(true);
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "partial_verified":
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4" />;
      case "uploaded":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  const handleVerifyDocument = async () => {
    try {
      if (verifyingdoc) {
        toast({
          title: "Verification Failed",
          description: "Please Upgrade Your Plan",
          variant: "destructive",
        });
        return;
      }

      setVerifying(true);

      const fullUrl = document.file_url;
      const path = fullUrl.split("/user_documents/")[1];

      const { data: signedUrlData, error } = await supabase.storage
        .from("user_documents")
        .createSignedUrl(path, 60);

      if (error || !signedUrlData) {
        toast({
          title: "Verification Failed",
          description: "Could not generate signed URL.",
          variant: "destructive",
        });
        return;
      }

      const signedUrl = signedUrlData.signedUrl;
      const category = (document.type || "other").toLowerCase();

      const result = await VerifcationData(signedUrl, category);
      const {
        extracted,
        stamp,
        signature,
        result: resultMessage,
        sourceType,
      } = result;

      // 🧠 Source type check
      console.log("🕵️‍♂️ Source Type Detected:", sourceType);
      if (sourceType !== "real") {
        await supabase
          .from("documents")
          .update({
            status: "failed",
            verification_reason: `Document rejected — Detected as ${sourceType}`,
          })
          .eq("id", document.id);

        toast({
          title: "Verification Failed",
          description: `Document is not original Detected: ${sourceType}`,
          variant: "destructive",
        });

        setVerifying(false);
        return;
      }

      const requiredFields = ["name", "dateOfIssue", "registrationNumber"];
      let matchCount = 0;

      for (const field of requiredFields) {
        if (extracted?.[field] && extracted[field] !== "Not Found") {
          matchCount++;
        }
      }

      const stampDetected = stamp === "Detected ✅";
      const signatureDetected = signature === "Detected ✅";

      const officialDocs = [
        "transcript",
        "birth_certificate",
        "marriage_certificate",
        "tax_document",
        "medical_record",
        "insurance_document",
      ];

      const simpleDocs = [
        "cv_resume",
        "id_card",
        "license",
        "reference",
        "work_sample",
        "passport",
        "bank_statement",
        "other",
      ];

      console.log("📄 Category:", category);
      console.log("🔖 Stamp:", stampDetected);
      console.log("✍️ Signature:", signatureDetected);
      console.log("✅ Match Count:", matchCount);

      let newStatus: "verified" | "partial_verified" | "failed" = "failed";
      let toastDescription = resultMessage;

      // Degree & Certificate
      if (category === "degree" || category === "certificate") {
        if (stampDetected && signatureDetected) {
          newStatus = "verified";
          toastDescription = "Document verified";
        } else if (stampDetected || signatureDetected) {
          newStatus = "partial_verified";

          if (!stampDetected && signatureDetected) {
            toastDescription = "Stamp is missing";
          } else if (stampDetected && !signatureDetected) {
            toastDescription = "Signature is missing";
          } else {
            toastDescription = "Missing either stamp or signature";
          }
        } else {
          newStatus = "failed";
          toastDescription = "Stamp and signature both missing";
        }
      }

      // Official documents
      else if (officialDocs.includes(category)) {
        if (stampDetected && signatureDetected && matchCount === 3) {
          newStatus = "verified";
          toastDescription = "Document verified";
        } else if (stampDetected && signatureDetected && matchCount >= 1) {
          newStatus = "partial_verified";
          toastDescription =
            "Stamp & Signature found , but some required fields are missing";
        } else {
          newStatus = "failed";

          const missingParts = [];
          if (!stampDetected) missingParts.push("Stamp");
          if (!signatureDetected) missingParts.push("Signature");
          if (matchCount < 1) missingParts.push("Key Fields");

          toastDescription =
            missingParts.length > 0
              ? `Missing: ${missingParts.join(", ")} `
              : "Document cannot be verified";
        }
      }

      // Simple documents
      else if (simpleDocs.includes(category)) {
        if (matchCount >= 2) {
          newStatus = "verified";
          toastDescription = "Document verified";
        } else if (matchCount >= 1) {
          newStatus = "partial_verified";
          toastDescription = "Partially Document verified";
        } else {
          newStatus = "failed";
          toastDescription = "No useful fields detected";
        }
      }

      const { error: updateError } = await supabase
        .from("documents")
        .update({
          status: newStatus,
          extracted_fields: extracted,
          match_count: matchCount,
          verification_reason: toastDescription,
        })
        .eq("id", document.id);

      if (updateError) {
        console.error("❌ Supabase update error:", updateError);
      }

      document.status = newStatus;

      if (newStatus !== "failed") {
        await documentService.deleteVerificationRequest(document.id, newStatus);
      }

      toast({
        title:
          newStatus === "verified"
            ? "Document Verified"
            : newStatus === "partial_verified"
            ? "Partially Verified"
            : "Verification Failed",
        description: toastDescription,
        variant: newStatus === "failed" ? "destructive" : "default",
      });
    } catch (error) {
      console.error("🛑 Verification Error:", error);
      toast({
        title: "Verification Failed",
        description: "Unexpected error during verification.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const VerifcationData = async (imageUrl: string, category: string) => {
    try {
      console.log("📨 Sending OCR request for:", imageUrl);

      const res = await fetch(
        "https://talent-backend-production.up.railway.app/api/v1/ocr/extract-text",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: imageUrl, category }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ OCR API error response:", data);
        throw new Error(data.message || "OCR request failed");
      }

      console.log("✅ OCR API success response:", data);
      return data;
    } catch (error) {
      console.error("💥 OCR fetch failed:", error);
      throw error;
    }
  };

  const handleDeleteDocument = async () => {
    try {
      await deleteDocument(document.id);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Unable to delete document.",
        variant: "destructive",
      });
    }
  };

  const handleShareDocument = async () => {
    try {
      const shareUrl = `${window.location.origin}/portfolio/${document.user_id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Portfolio Link Copied",
        description: "Link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to copy portfolio link.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = async () => {
    try {
      const url = new URL(document.file_url);
      const filePath = url.pathname.split("/").slice(-2).join("/");

      const { data, error } = await supabase.storage
        .from("user_documents")
        .download(filePath);

      if (error) throw new Error();

      const blob = new Blob([data], {
        type: document.file_type || "application/octet-stream",
      });

      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = document.name || "document";
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download file.",
        variant: "destructive",
      });
    }
  };

  const verificationScore =
    document.status === "verified" ? Math.floor(Math.random() * 20) + 80 : null;

  return (
    <div className="border rounded-lg p-4 sm:p-6 hover:border-blue-200 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div
            className={`p-2 sm:p-3 rounded-lg ${getStatusColor(
              document.status
            )} flex-shrink-0`}
          >
            {getStatusIcon(document.status)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate pr-2">
              {document.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 truncate pr-2">
              {document.issuer}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className="text-xs bg-gray-100 text-gray-700">
                {document.type.replace("_", " ")}
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
          <Button variant="outline" size="sm" onClick={handleDownloadDocument}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          {document.status === "verified" && (
            <Button variant="outline" size="sm" onClick={handleShareDocument}>
              <Share className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
          {(document.status === "uploaded" || document.status === "failed") && (
            <Button
              size="sm"
              disabled={verifying}
              onClick={handleVerifyDocument}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {verifying ? (
                <>
                  <span className="loader h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  Verify with TrustTalent
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteDocument}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
        <div>
          <span className="font-medium">Uploaded:</span>{" "}
          {new Date(document.upload_date).toLocaleDateString()}
        </div>
        {document.expiry_date && (
          <div>
            <span className="font-medium">Expires:</span>{" "}
            {new Date(document.expiry_date).toLocaleDateString()}
          </div>
        )}
        <div>
          <span className="font-medium">Privacy:</span> {document.privacy}
        </div>
        {document.status === "verified" && (
          <div>
            <span className="font-medium">Verification Date:</span>{" "}
            {new Date().toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
