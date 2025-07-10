
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Document, VerificationRequest } from '@/types/documents';
import { documentService } from '@/services/documentService';
import { userService } from '@/services/userService';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      await fetchDocuments();
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive"
      });
    }
  };

  const fetchDocuments = async () => {
    try {
      const docs = await documentService.fetchDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, documentData: Partial<Document>) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      await documentService.uploadDocument(file, documentData, currentUser);
      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
      throw error;
    }
  };

  const requestVerification = async (documentId: string, requestType: VerificationRequest['request_type'] = 'ai_analysis') => {
    try {
      await documentService.requestVerification(documentId, requestType, currentUser);
      await fetchDocuments();
      
      toast({
        title: "Verification Started",
        description: "Your document has been sent to TalentTrust AI for verification. You'll be notified when complete.",
      });
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Error",
        description: "Failed to start verification",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId);
      await fetchDocuments();
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  return {
    documents,
    loading,
    currentUser,
    uploadDocument,
    requestVerification,
    deleteDocument,
    fetchDocuments
  };
};

export type { Document, VerificationRequest };
