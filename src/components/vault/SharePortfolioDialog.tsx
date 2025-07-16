import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Share,
  Copy,
  Eye,
  CheckCircle,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
import { Document } from "@/types/documents";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SharePortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
}

const SharePortfolioDialog = ({
  isOpen,
  onClose,
  documents,
}: SharePortfolioDialogProps) => {
  const [shareSettings, setShareSettings] = useState({
    includeVerifiedOnly: true,
    includePersonalInfo: true,
    includeContactInfo: false,
    allowDownloads: false,
    expiresIn: 30, // days
  });
  const [shareUrl, setShareUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  // Filter documents based on settings
  const filteredDocuments = documents.filter((doc) => {
    if (shareSettings.includeVerifiedOnly) {
      return doc.status === "verified";
    }
    return doc.status === "verified" || doc.status === "pending";
  });

  const verifiedCount = documents.filter(
    (doc) => doc.status === "verified"
  ).length;
  const totalCount = documents.length;

  const generateShareUrl = async () => {
    setIsGenerating(true);
    try {
      // Use the real user UUID for sharing
      const portfolioId = userProfile?.id;
      if (!portfolioId) {
        toast({
          title: "User ID not found",
          description: "Unable to generate portfolio link. Please try again.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      const baseUrl = window.location.origin;
      const generatedUrl = `${baseUrl}/portfolio/${portfolioId}`;
      setShareUrl(generatedUrl);

      toast({
        title: "Portfolio Link Generated",
        description: "Your shareable portfolio link is ready!",
      });
    } catch (error) {
      console.error("Failed to generate share URL:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate portfolio link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Portfolio link copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (key: string, value: boolean | number) => {
    setShareSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset share URL when settings change
    setShareUrl("");
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "degree":
        return "bg-blue-100 text-blue-700";
      case "certificate":
        return "bg-purple-100 text-purple-700";
      case "license":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share className="h-5 w-5 text-purple-600" />
            <span>Share Portfolio</span>
          </DialogTitle>
          <DialogDescription>
            Create a shareable link to showcase your verified credentials to
            employers or institutions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sharing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Only Verified Documents</Label>
                    <p className="text-sm text-gray-600">
                      Include only documents that have been verified
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.includeVerifiedOnly}
                    onCheckedChange={(checked) =>
                      handleSettingChange("includeVerifiedOnly", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Personal Information</Label>
                    <p className="text-sm text-gray-600">
                      Show your name and professional title
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.includePersonalInfo}
                    onCheckedChange={(checked) =>
                      handleSettingChange("includePersonalInfo", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Contact Information</Label>
                    <p className="text-sm text-gray-600">
                      Allow viewers to see your contact details
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.includeContactInfo}
                    onCheckedChange={(checked) =>
                      handleSettingChange("includeContactInfo", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Downloads</Label>
                    <p className="text-sm text-gray-600">
                      Let viewers download document certificates
                    </p>
                  </div>
                  <Switch
                    checked={shareSettings.allowDownloads}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowDownloads", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="expires">Link Expires In (Days)</Label>
                  <Input
                    id="expires"
                    type="number"
                    min="1"
                    max="365"
                    value={shareSettings.expiresIn}
                    onChange={(e) =>
                      handleSettingChange("expiresIn", parseInt(e.target.value))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {shareUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <span>Share Link Generated</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyToClipboard} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>Public link</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Lock className="h-4 w-4" />
                      <span>Expires in {shareSettings.expiresIn} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Preview</CardTitle>
                <p className="text-sm text-gray-600">
                  This is what viewers will see when they visit your portfolio
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {userProfile?.full_name || "Your Name"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Professional Portfolio
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    <Shield className="h-3 w-3 mr-1" />
                    {verifiedCount} Verified
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Documents to Include:</span>
                    <Badge variant="outline">
                      {filteredDocuments.length} documents
                    </Badge>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {filteredDocuments.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No documents to share</p>
                        <p className="text-xs">
                          {shareSettings.includeVerifiedOnly
                            ? "You need verified documents to share"
                            : "Upload some documents first"}
                        </p>
                      </div>
                    ) : (
                      filteredDocuments.map((doc, index) => (
                        <div
                          key={doc.id}
                          className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {doc.issuer}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge
                              className={`${getDocumentTypeColor(
                                doc.type
                              )} text-xs`}
                            >
                              {doc.type.replace("_", " ")}
                            </Badge>
                            {doc.status === "verified" && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            <p>Share your verified credentials with confidence.</p>
            <p>Links are secure and expire automatically.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {!shareUrl ? (
              <Button
                onClick={generateShareUrl}
                disabled={isGenerating || filteredDocuments.length === 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <FileText className="h-4 w-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4 mr-2" />
                    Generate Link
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePortfolioDialog;
