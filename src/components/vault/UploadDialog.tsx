
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import UploadMethodSelector from "./UploadMethodSelector";
import FileUploadInput from "./FileUploadInput";
import DocumentFormFields from "./DocumentFormFields";
import UploadActions from "./UploadActions";

interface UploadDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const UploadDialog = ({ isOpen: externalIsOpen, onClose: externalOnClose }: UploadDialogProps = {}) => {
  const [uploadMethod, setUploadMethod] = useState<"file" | "camera">("file");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [customDocumentType, setCustomDocumentType] = useState("");
  const [issuer, setIssuer] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const { uploadDocument } = useDocuments();
  const { toast } = useToast();

  // Use external props if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose ? 
    (open: boolean) => { if (!open) externalOnClose(); } :
    setInternalIsOpen;

  const resetUploadForm = () => {
    setUploadMethod("file");
    setCapturedImage(null);
    setSelectedFile(null);
    setDocumentName("");
    setDocumentType("");
    setCustomDocumentType("");
    setIssuer("");
    setExpiryDate("");
    setIsUploading(false);
  };

  const convertDataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);

      if (!documentName || !documentType || !issuer) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      let fileToUpload: File | null = null;

      if (uploadMethod === "file" && selectedFile) {
        fileToUpload = selectedFile;
      } else if (uploadMethod === "camera" && capturedImage) {
        fileToUpload = convertDataUrlToFile(capturedImage, `${documentName}.jpg`);
      }

      if (!fileToUpload) {
        toast({
          title: "No File Selected",
          description: "Please select a file or capture an image",
          variant: "destructive"
        });
        return;
      }

      // Use custom document type if "other" is selected, otherwise use the selected type
      let finalDocumentType: string;
      if (documentType === "other") {
        if (!customDocumentType.trim()) {
          toast({
            title: "Missing Custom Type",
            description: "Please specify the custom document type",
            variant: "destructive"
          });
          return;
        }
        finalDocumentType = customDocumentType.trim();
      } else {
        finalDocumentType = documentType;
      }

      console.log('Uploading document with type:', finalDocumentType);

      // First upload the document - uploadDocument doesn't return the document object
      await uploadDocument(fileToUpload, {
        name: documentName,
        type: finalDocumentType as any,
        issuer: issuer,
        expiry_date: expiryDate || undefined,
        privacy: 'private'
      });

      // Then trigger verification without document ID since we don't have it
      try {
        const { verificationService } = await import('@/services/verificationService');
        const verificationResult = await verificationService.verifyDocument(fileToUpload);

        if (verificationResult.success) {
          toast({
            title: "Document Uploaded and Verified",
            description: `Document uploaded successfully. Verification status: ${verificationResult.verification?.status}`,
          });
        } else {
          toast({
            title: "Document Uploaded",
            description: "Document uploaded but verification failed. You can try verification again later.",
            variant: "destructive"
          });
        }
      } catch (verificationError) {
        console.error('Verification error:', verificationError);
        toast({
          title: "Document Uploaded",
          description: "Document uploaded but verification is temporarily unavailable.",
        });
      }

      setIsOpen(false);
      resetUploadForm();
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // Always use Dialog component to maintain context
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetUploadForm();
    }}>
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogDescription>
            Add a new document to your secure vault for verification
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <UploadMethodSelector 
            uploadMethod={uploadMethod}
            setUploadMethod={setUploadMethod}
          />
          
          <FileUploadInput
            uploadMethod={uploadMethod}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            capturedImage={capturedImage}
            setCapturedImage={setCapturedImage}
            setDocumentName={setDocumentName}
            documentName={documentName}
          />

          <DocumentFormFields
            documentName={documentName}
            setDocumentName={setDocumentName}
            documentType={documentType}
            setDocumentType={setDocumentType}
            customDocumentType={customDocumentType}
            setCustomDocumentType={setCustomDocumentType}
            issuer={issuer}
            setIssuer={setIssuer}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
          />
          
          <UploadActions
            onUpload={handleUpload}
            onCancel={handleCancel}
            isUploading={isUploading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
