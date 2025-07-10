
import { Button } from "@/components/ui/button";

interface UploadActionsProps {
  onUpload: () => void;
  onCancel: () => void;
  isUploading: boolean;
}

const UploadActions = ({ onUpload, onCancel, isUploading }: UploadActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        className="flex-1" 
        onClick={onUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Document"}
      </Button>
      <Button 
        variant="outline" 
        className="flex-1"
        onClick={onCancel}
        disabled={isUploading}
      >
        Cancel
      </Button>
    </div>
  );
};

export default UploadActions;
