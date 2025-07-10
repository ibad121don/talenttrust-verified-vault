
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import CameraCapture from "./CameraCapture";
import { useToast } from "@/hooks/use-toast";

interface FileUploadInputProps {
  uploadMethod: "file" | "camera";
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  setDocumentName: (name: string) => void;
  documentName: string;
}

const FileUploadInput = ({
  uploadMethod,
  selectedFile,
  setSelectedFile,
  capturedImage,
  setCapturedImage,
  setDocumentName,
  documentName
}: FileUploadInputProps) => {
  const { toast } = useToast();
  const cameraCapture = CameraCapture({ onCapture: setCapturedImage });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a PDF, JPEG, or PNG file",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  return (
    <div>
      <Label htmlFor="file">
        {uploadMethod === "file" ? "Select File" : "Capture Document"}
      </Label>
      {uploadMethod === "file" ? (
        <div className="space-y-2">
          <Input 
            id="file" 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
          <p className="text-xs text-gray-500">
            Supported formats: PDF, JPEG, PNG (max 10MB)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={cameraCapture.handleCameraCapture}
            className="w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            Take Photo
          </Button>
          {capturedImage && (
            <div className="mt-2">
              <img 
                src={capturedImage} 
                alt="Captured document" 
                className="w-full h-32 object-cover rounded-md border"
              />
              <p className="text-sm text-green-600 mt-1">✓ Document captured</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadInput;
