export interface Document {
  body: any;
  id: string;
  user_id: string;
  name: string;
  type:
    | "degree"
    | "certificate"
    | "license"
    | "reference"
    | "work_sample"
    | "cv_resume"
    | "transcript"
    | "passport"
    | "id_card"
    | "birth_certificate"
    | "marriage_certificate"
    | "bank_statement"
    | "insurance_document"
    | "tax_document"
    | "medical_record"
    | "other";
  issuer: string;
  institution_id?: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  upload_date: string;
  expiry_date?: string;
  status:
    | "uploaded"
    | "pending"
    | "verified"
    | "failed"
    | "expired"
    | "partial_verified";
  privacy: "private" | "shared" | "public";
  metadata?: any;
  created_at: string;
  updated_at: string;
  verification_requests?: VerificationRequest[];
}

export interface VerificationRequest {
  id: string;
  document_id: string;
  user_id: string;
  request_type: "ai_analysis" | "institution_verify" | "manual_review";
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled";
  priority: number;
  requested_at: string;
  started_at?: string;
  completed_at?: string;
  metadata?: any;
}
