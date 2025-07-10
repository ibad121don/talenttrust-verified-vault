
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from "lucide-react";

interface UploadMethodSelectorProps {
  uploadMethod: "file" | "camera";
  setUploadMethod: (method: "file" | "camera") => void;
}

const UploadMethodSelector = ({ uploadMethod, setUploadMethod }: UploadMethodSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Upload Method</Label>
      <div className="flex space-x-2">
        <Button 
          variant={uploadMethod === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMethod("file")}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          File Upload
        </Button>
        <Button 
          variant={uploadMethod === "camera" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMethod("camera")}
          className="flex-1"
        >
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
      </div>
    </div>
  );
};

export default UploadMethodSelector;
