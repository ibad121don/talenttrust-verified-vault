
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Zap, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Document } from "@/types/documents";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

interface VerifyDocumentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
}

const VerifyDocumentsDialog = ({ isOpen, onClose, documents }: VerifyDocumentsDialogProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const { requestVerification } = useDocuments();
  const { toast } = useToast();

  // Filter documents that can be verified (uploaded or failed status)
  const verifiableDocuments = documents.filter(doc => 
    doc.status === 'uploaded' || doc.status === 'failed'
  );

  const handleDocumentToggle = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === verifiableDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(verifiableDocuments.map(doc => doc.id));
    }
  };

  const handleStartVerification = async () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      for (const documentId of selectedDocuments) {
        await requestVerification(documentId, 'ai_analysis');
      }
      
      toast({
        title: "Verification Started",
        description: `${selectedDocuments.length} document(s) sent to TalentTrust AI for verification.`,
      });
      
      setSelectedDocuments([]);
      onClose();
    } catch (error) {
      console.error('Bulk verification failed:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to start verification for some documents.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "failed": return "text-red-600 bg-red-100";
      case "uploaded": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Verify Documents</span>
          </DialogTitle>
          <DialogDescription>
            Select documents to verify with TalentTrust AI. Only uploaded or previously failed documents can be verified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {verifiableDocuments.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents to Verify</h3>
              <p className="text-gray-600">
                All your documents are either already verified or currently being processed.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedDocuments.length === verifiableDocuments.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All ({verifiableDocuments.length} documents)
                  </label>
                </div>
                <Badge variant="outline">
                  {selectedDocuments.length} selected
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {verifiableDocuments.map((document) => (
                  <Card key={document.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`doc-${document.id}`}
                        checked={selectedDocuments.includes(document.id)}
                        onCheckedChange={(checked) => 
                          handleDocumentToggle(document.id, checked as boolean)
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 truncate">
                              {document.name}
                            </h4>
                            <p className="text-sm text-gray-600 truncate">
                              {document.issuer}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="text-xs">
                                {document.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={`${getStatusColor(document.status)} text-xs`}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1">{document.status}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>Selected documents will be verified using TalentTrust AI.</p>
                  <p>Verification typically takes 2-5 minutes per document.</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onClose} disabled={isVerifying}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleStartVerification} 
                    disabled={selectedDocuments.length === 0 || isVerifying}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isVerifying ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Start Verification ({selectedDocuments.length})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyDocumentsDialog;
