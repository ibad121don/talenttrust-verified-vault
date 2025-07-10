import { supabase } from "@/integrations/supabase/client";
import { securityService } from "./securityService";
import { Document, VerificationRequest } from "@/types/documents";

export const documentService = {
  async fetchDocuments(): Promise<Document[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data: userRecord } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.user.id)
      .single();

    try {
      if (userRecord) {
        await securityService.logAuditEvent({
          user_id: userRecord.id,
          action: "view_documents",
          resource_type: "documents",
        });
      }
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }

    const { data, error } = await supabase
      .from("documents")
      .select(
        `
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
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (userRecord && data) {
      await this.updateUserDocumentCount(userRecord.id, data);
    }

    return (data || []).map((doc) => ({
      ...doc,
      type: doc.type as Document["type"],
      status: doc.status as Document["status"],
      privacy: doc.privacy as Document["privacy"],
      verification_requests:
        doc.verification_requests?.map((vr: any) => ({
          ...vr,
          request_type: vr.request_type as VerificationRequest["request_type"],
          status: vr.status as VerificationRequest["status"],
        })) || [],
    }));
  },

  async updateUserDocumentCount(userId: string, documents: any[]) {
    try {
      const totalDocuments = documents.length;
      const verifiedDocuments = documents.filter(
        (doc) => doc.status === "verified"
      ).length;

      await supabase
        .from("users")
        .update({
          total_documents: totalDocuments,
          documents_verified: verifiedDocuments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (error) {
      console.error("Failed to update user document count:", error);
    }
  },

  async uploadDocument(
    file: File,
    documentData: Partial<Document>,
    currentUser: any
  ): Promise<any> {
    if (!currentUser) throw new Error("User not authenticated");

    const fileValidation = securityService.validateFile(file);
    if (!fileValidation.valid) {
      throw new Error(fileValidation.error);
    }

    const fileHash = await securityService.generateFileHash(file);
    const encryptedName = securityService.encryptData(
      documentData.name || file.name
    );
    const encryptedIssuer = securityService.encryptData(
      documentData.issuer || ""
    );

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${currentUser.auth_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("user_documents")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("user_documents").getPublicUrl(filePath);

    const dbDocumentType = documentData.type || "certificate";

    const { data, error } = await supabase
      .from("documents")
      .insert({
        user_id: currentUser.id,
        name: encryptedName,
        type: dbDocumentType,
        issuer: encryptedIssuer,
        file_url: publicUrl,
        file_size: file.size,
        file_type: file.type,
        file_hash: fileHash,
        expiry_date: documentData.expiry_date,
        status: "uploaded",
        privacy: documentData.privacy || "private",
        encrypted: true,
        malware_scan_status: "pending",
        metadata: null,
      })
      .select()
      .single();

    if (error) throw error;

    await this.syncUserDocumentCount(currentUser.id);

    try {
      await securityService.logAuditEvent({
        user_id: currentUser.id,
        action: "document_upload",
        resource_type: "document",
        resource_id: data.id,
        details: {
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          encrypted: true,
          original_type: documentData.type,
        },
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }

    return data;
  },

  async syncUserDocumentCount(userId: string) {
    try {
      const { data: documents, error } = await supabase
        .from("documents")
        .select("id, status")
        .eq("user_id", userId);

      if (error) throw error;

      const totalDocuments = documents?.length || 0;
      const verifiedDocuments =
        documents?.filter((doc) => doc.status === "verified").length || 0;

      await supabase
        .from("users")
        .update({
          total_documents: totalDocuments,
          documents_verified: verifiedDocuments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (error) {
      console.error("Failed to sync user document count:", error);
    }
  },

  async requestVerification(
    documentId: string,
    requestType: VerificationRequest["request_type"],
    currentUser: any
  ): Promise<any> {
    if (!currentUser) throw new Error("User not authenticated");

    const validRequestTypes = ["ai_analysis", "manual"];
    if (!validRequestTypes.includes(requestType)) {
      throw new Error(`Invalid request_type: ${requestType}`);
    }

    const { data, error } = await supabase
      .from("verification_requests")
      .insert({
        document_id: documentId,
        user_id: currentUser.id,
        request_type: requestType,
        status: "pending",
        priority: 1,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("documents")
      .update({ status: "pending" })
      .eq("id", documentId);

    try {
      await securityService.logAuditEvent({
        user_id: currentUser.id,
        action: "verification_request",
        resource_type: "document",
        resource_id: documentId,
        details: {
          request_type: requestType,
          request_id: data.id,
        },
      });
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }

    return data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");

    const { data: userRecord } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.user.id)
      .single();

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (error) throw error;

    if (userRecord) {
      await this.syncUserDocumentCount(userRecord.id);
    }

    try {
      if (userRecord) {
        await securityService.logAuditEvent({
          user_id: userRecord.id,
          action: "document_delete",
          resource_type: "document",
          resource_id: documentId,
          details: { permanent_deletion: true },
        });
      }
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  },

  async deleteVerificationRequest(
    documentId: string,
    newStatus: "verified" | "partial_verified" = "verified"
  ): Promise<void> {
    const { data: request, error: fetchError } = await supabase
      .from("verification_requests")
      .select("*")
      .eq("document_id", documentId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch verification request:", fetchError);
      return;
    }

    const { error: deleteError } = await supabase
      .from("verification_requests")
      .delete()
      .eq("document_id", documentId);

    if (deleteError) throw deleteError;

    await supabase
      .from("documents")
      .update({ status: newStatus })
      .eq("id", documentId);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { data: userRecord } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.user.id)
          .single();

        if (userRecord) {
          await securityService.logAuditEvent({
            user_id: userRecord.id,
            action: "verification_request_deleted",
            resource_type: "verification_request",
            resource_id: request.id,
            details: {
              document_id: documentId,
              request_type: request.request_type,
              original_status: request.status,
              deleted_at: new Date().toISOString(),
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to log deletion event:", error);
    }
  },

  decryptDocumentName(encryptedName: string): string {
    try {
      return securityService.decryptData(encryptedName);
    } catch (error) {
      console.error("Failed to decrypt document name:", error);
      return "Encrypted Document";
    }
  },

  decryptDocumentIssuer(encryptedIssuer: string): string {
    try {
      return securityService.decryptData(encryptedIssuer);
    } catch (error) {
      console.error("Failed to decrypt document issuer:", error);
      return "Encrypted Issuer";
    }
  },
};
