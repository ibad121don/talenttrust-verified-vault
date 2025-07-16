import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/types/documents";

export const publicPortfolioService = {
  async fetchVerifiedDocumentsByPortfolioId(
    portfolioId: string
  ): Promise<Document[]> {
    // Now, portfolioId is the user_id (uuid)
    if (!portfolioId) return [];
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", portfolioId)
      .eq("status", "verified");
    if (error) throw error;
    if (!data || data.length === 0) return [];
    return data.map((doc: any) => ({
      body: doc.body || {},
      id: doc.id,
      user_id: doc.user_id,
      name: doc.name,
      type: (doc.type as Document["type"]) || "other",
      issuer: doc.issuer,
      institution_id: doc.institution_id,
      file_url: doc.file_url,
      file_size: doc.file_size,
      file_type: doc.file_type,
      upload_date: doc.upload_date,
      expiry_date: doc.expiry_date,
      status: (doc.status as Document["status"]) || "verified",
      privacy: (doc.privacy as Document["privacy"]) || "private",
      metadata: doc.metadata,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      verification_requests: doc.verification_requests || [],
    }));
  },
};
