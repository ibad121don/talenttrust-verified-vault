
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const { toast } = useToast();

  const handleCameraCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          const captureDiv = document.createElement('div');
          captureDiv.style.position = 'fixed';
          captureDiv.style.top = '0';
          captureDiv.style.left = '0';
          captureDiv.style.width = '100vw';
          captureDiv.style.height = '100vh';
          captureDiv.style.backgroundColor = 'black';
          captureDiv.style.zIndex = '9999';
          captureDiv.style.display = 'flex';
          captureDiv.style.flexDirection = 'column';
          captureDiv.style.alignItems = 'center';
          captureDiv.style.justifyContent = 'center';
          
          video.style.width = '100%';
          video.style.height = 'auto';
          video.style.maxHeight = '80vh';
          
          const captureBtn = document.createElement('button');
          captureBtn.textContent = 'Capture';
          captureBtn.style.margin = '20px';
          captureBtn.style.padding = '15px 30px';
          captureBtn.style.fontSize = '18px';
          captureBtn.style.backgroundColor = '#3b82f6';
          captureBtn.style.color = 'white';
          captureBtn.style.border = 'none';
          captureBtn.style.borderRadius = '8px';
          captureBtn.style.cursor = 'pointer';
          
          const closeBtn = document.createElement('button');
          closeBtn.textContent = 'Close';
          closeBtn.style.margin = '10px';
          closeBtn.style.padding = '10px 20px';
          closeBtn.style.fontSize = '16px';
          closeBtn.style.backgroundColor = '#6b7280';
          closeBtn.style.color = 'white';
          closeBtn.style.border = 'none';
          closeBtn.style.borderRadius = '8px';
          closeBtn.style.cursor = 'pointer';
          
          captureDiv.appendChild(video);
          captureDiv.appendChild(captureBtn);
          captureDiv.appendChild(closeBtn);
          document.body.appendChild(captureDiv);
          
          captureBtn.onclick = () => {
            ctx?.drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            onCapture(imageData);
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(captureDiv);
            toast({
              title: "Photo Captured",
              description: "Document photo captured successfully. Fill in the details below.",
            });
          };
          
          closeBtn.onclick = () => {
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(captureDiv);
          };
        };
      } else {
        // Fallback for browsers without camera access
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.onchange = (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              onCapture(e.target?.result as string);
              toast({
                title: "Photo Selected",
                description: "Document photo selected successfully. Fill in the details below.",
              });
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      // Fallback to file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            onCapture(e.target?.result as string);
            toast({
              title: "Photo Selected",
              description: "Document photo selected successfully. Fill in the details below.",
            });
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    }
  };

  return { handleCameraCapture };
};

export default CameraCapture;
