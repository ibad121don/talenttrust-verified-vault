import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';
import { Document, VerificationRequest } from '@/types/documents';

export const documentService = {
  async fetchDocuments(): Promise<Document[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    // Get user record from users table
    const { data: userRecord } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    // Log access to documents (with error handling)
    try {
      if (userRecord) {
        await securityService.logAuditEvent({
          user_id: userRecord.id, // Use users table ID, not auth ID
          action: 'view_documents',
          resource_type: 'documents'
        });
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Continue execution - audit logging shouldn't block main functionality
    }

    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        institutions (name, type),
        verification_requests (
          id,
          document_id,
          user_id,
          status,
          request_type,
          priority,
          requested_at,
          started_at,
          completed_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Update user document count after fetching
    if (userRecord && data) {
      await this.updateUserDocumentCount(userRecord.id, data);
    }
    
    return (data || []).map(doc => ({
      ...doc,
      type: doc.type as Document['type'],
      status: doc.status as Document['status'],
      privacy: doc.privacy as Document['privacy'],
      verification_requests: doc.verification_requests?.map((vr: any) => ({
        ...vr,
        request_type: vr.request_type as VerificationRequest['request_type'],
        status: vr.status as VerificationRequest['status']
      })) || []
    }));
  },

  async updateUserDocumentCount(userId: string, documents: any[]) {
    try {
      const totalDocuments = documents.length;
      const verifiedDocuments = documents.filter(doc => doc.status === 'verified').length;
      
      await supabase
        .from('users')
        .update({
          total_documents: totalDocuments,
          documents_verified: verifiedDocuments,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to update user document count:', error);
    }
  },

  async uploadDocument(file: File, documentData: Partial<Document>, currentUser: any): Promise<any> {
    if (!currentUser) throw new Error('User not authenticated');

    // Security validations
    const fileValidation = securityService.validateFile(file);
    if (!fileValidation.valid) {
      throw new Error(fileValidation.error);
    }

    // Generate file hash for integrity
    const fileHash = await securityService.generateFileHash(file);

    // Encrypt sensitive document metadata
    const encryptedName = securityService.encryptData(documentData.name || file.name);
    const encryptedIssuer = securityService.encryptData(documentData.issuer || '');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${currentUser.auth_id}/${fileName}`;

    // Upload to secure storage
    const { error: uploadError } = await supabase.storage
      .from('user_documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('user_documents')
      .getPublicUrl(filePath);

    // Map document type to valid database enum value
    let dbDocumentType = documentData.type || 'certificate';
    
    // List of valid document types from the database enum
    const validTypes = [
      'degree', 'certificate', 'license', 'reference', 'work_sample', 
      'cv_resume', 'transcript', 'passport', 'id_card', 'birth_certificate', 
      'marriage_certificate', 'bank_statement', 'insurance_document', 
      'tax_document', 'medical_record'
    ];
    
    // If the type is not in the valid enum list, default to 'certificate'
    if (!validTypes.includes(dbDocumentType)) {
      console.log(`Custom document type "${dbDocumentType}" mapped to "certificate"`);
      dbDocumentType = 'certificate';
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: currentUser.id, // Use users table ID
        name: encryptedName,
        type: dbDocumentType,
        issuer: encryptedIssuer,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        file_hash: fileHash,
        expiry_date: documentData.expiry_date,
        status: 'uploaded',
        privacy: documentData.privacy || 'private',
        encrypted: true,
        malware_scan_status: 'pending',
        // Store the original custom type in metadata if it was different
        metadata: dbDocumentType !== documentData.type ? { original_type: documentData.type } : null
      })
      .select()
      .single();

    if (error) throw error;

    // Update user document count after upload
    await this.syncUserDocumentCount(currentUser.id);

    // Log document upload (with error handling)
    try {
      await securityService.logAuditEvent({
        user_id: currentUser.id, // Use users table ID
        action: 'document_upload',
        resource_type: 'document',
        resource_id: data.id,
        details: {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          encrypted: true,
          original_type: documentData.type
        }
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Continue execution - audit logging shouldn't block main functionality
    }

    return data;
  },

  async syncUserDocumentCount(userId: string) {
    try {
      // Get current document count from database
      const { data: documents, error } = await supabase
        .from('documents')
        .select('id, status')
        .eq('user_id', userId);

      if (error) throw error;

      const totalDocuments = documents?.length || 0;
      const verifiedDocuments = documents?.filter(doc => doc.status === 'verified').length || 0;
      
      // Update user profile with current counts
      await supabase
        .from('users')
        .update({
          total_documents: totalDocuments,
          documents_verified: verifiedDocuments,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to sync user document count:', error);
    }
  },

  async requestVerification(documentId: string, requestType: VerificationRequest['request_type'], currentUser: any): Promise<any> {
    if (!currentUser) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('verification_requests')
      .insert({
        document_id: documentId,
        user_id: currentUser.id, // Use users table ID
        request_type: requestType,
        status: 'pending',
        priority: 1
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('documents')
      .update({ status: 'pending' })
      .eq('id', documentId);

    // Log verification request (with error handling)
    try {
      await securityService.logAuditEvent({
        user_id: currentUser.id, // Use users table ID
        action: 'verification_request',
        resource_type: 'document',
        resource_id: documentId,
        details: {
          request_type: requestType,
          request_id: data.id
        }
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Continue execution - audit logging shouldn't block main functionality
    }

    return data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Get user record from users table
    const { data: userRecord } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.user.id)
      .single();

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;

    // Update user document count after deletion
    if (userRecord) {
      await this.syncUserDocumentCount(userRecord.id);
    }

    // Log document deletion (with error handling)
    try {
      if (userRecord) {
        await securityService.logAuditEvent({
          user_id: userRecord.id, // Use users table ID
          action: 'document_delete',
          resource_type: 'document',
          resource_id: documentId,
          details: { permanent_deletion: true }
        });
      }
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Continue execution - audit logging shouldn't block main functionality
    }
  },

  // Decrypt document name for display
  decryptDocumentName(encryptedName: string): string {
    try {
      return securityService.decryptData(encryptedName);
    } catch (error) {
      console.error('Failed to decrypt document name:', error);
      return 'Encrypted Document';
    }
  },

  // Decrypt document issuer for display
  decryptDocumentIssuer(encryptedIssuer: string): string {
    try {
      return securityService.decryptData(encryptedIssuer);
    } catch (error) {
      console.error('Failed to decrypt document issuer:', error);
      return 'Encrypted Issuer';
    }
  }
};
