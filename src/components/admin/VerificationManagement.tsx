import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, CheckCircle, XCircle, AlertTriangle, Clock, User, FileText } from 'lucide-react';

interface Verification {
  id: string;
  user_id: string;
  document_id: string | null;
  filename: string;
  status: string;
  explanation: string | null;
  ai_confidence_score: number | null;
  admin_override: boolean | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  processed_text: string | null;
}

interface VerificationManagementProps {
  onStatusUpdate?: () => void;
}

const VerificationManagement = ({ onStatusUpdate }: VerificationManagementProps) => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        title: "Error",
        description: "Failed to load verifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (verificationId: string) => {
    if (!newStatus || !selectedVerification) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: newStatus,
          admin_override: true,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Verification status updated successfully"
      });

      fetchVerifications();
      setSelectedVerification(null);
      setAdminNotes('');
      setNewStatus('');
      
      // Call the callback to refresh admin stats
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspicious':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Verification Management</CardTitle>
          <CardDescription>
            Review and manage document verification results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verifications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No verifications found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{verification.filename}</p>
                            <p className="text-sm text-gray-500">ID: {verification.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(verification.status)}
                          <Badge className={getStatusColor(verification.status)}>
                            {verification.status}
                          </Badge>
                          {verification.admin_override && (
                            <Badge variant="outline" className="text-xs">
                              Override
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {verification.ai_confidence_score ? (
                          <span className="text-sm font-medium">
                            {verification.ai_confidence_score}%
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVerification(verification)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedVerification && (
        <Card>
          <CardHeader>
            <CardTitle>Update Verification Status</CardTitle>
            <CardDescription>
              Review and update the status for: {selectedVerification.filename}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">AI Analysis</h4>
              <p className="text-sm text-gray-700 mb-2">
                {selectedVerification.explanation || 'No explanation available'}
              </p>
              {selectedVerification.ai_confidence_score && (
                <p className="text-sm text-gray-600">
                  <strong>Confidence Score:</strong> {selectedVerification.ai_confidence_score}%
                </p>
              )}
              {selectedVerification.admin_notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Previous Admin Notes:</strong> {selectedVerification.admin_notes}
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="suspicious">Suspicious</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this verification decision..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => updateVerificationStatus(selectedVerification.id)}
                disabled={!newStatus || updating}
                className="flex items-center gap-2"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : null}
                {updating ? 'Updating...' : 'Update Status'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedVerification(null);
                  setAdminNotes('');
                  setNewStatus('');
                }}
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificationManagement;
