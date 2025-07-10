
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Document verification request received');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get user from users table, create if doesn't exist
    let { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (userDataError || !userData) {
      console.log('User not found in users table, creating new user record');
      
      // Create user record
      const { data: newUser, error: createUserError } = await supabaseClient
        .from('users')
        .insert({
          auth_id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
          user_type: 'job_seeker'
        })
        .select('id')
        .single();

      if (createUserError) {
        console.error('Failed to create user:', createUserError);
        throw new Error('Failed to create user record');
      }

      userData = newUser;
    }

    const formData = await req.formData();
    const file = formData.get('document') as File;
    const documentId = formData.get('document_id') as string;

    if (!file) {
      throw new Error('No document file provided');
    }

    console.log('Processing document:', file.name, 'Size:', file.size);

    // Convert file to base64 for Google Document AI
    const fileBuffer = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    // Simplified document processing - in production you'd call Google Document AI
    const documentText = await analyzeDocument(base64Content, file.type);
    
    // Determine verification status based on document analysis
    const verificationResult = analyzeDocumentContent(documentText, file.name);

    console.log('Verification result:', verificationResult);

    // Store verification result in database
    const { data: verification, error: verificationError } = await supabaseClient
      .from('verifications')
      .insert({
        user_id: userData.id,
        document_id: documentId || null,
        filename: file.name,
        status: verificationResult.status,
        explanation: verificationResult.explanation,
        ai_confidence_score: verificationResult.confidence,
        processed_text: documentText.substring(0, 1000) // Store first 1000 chars
      })
      .select()
      .single();

    if (verificationError) {
      console.error('Database error:', verificationError);
      throw new Error('Failed to store verification result');
    }

    return new Response(JSON.stringify({
      success: true,
      verification: {
        id: verification.id,
        status: verification.status,
        explanation: verification.explanation,
        confidence: verification.ai_confidence_score
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-document function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simplified document text extraction (in production, use Google Document AI)
async function analyzeDocument(base64Content: string, mimeType: string): Promise<string> {
  // This is a simplified version - in production you'd call Google Document AI
  console.log('Analyzing document of type:', mimeType);
  
  if (mimeType.includes('pdf')) {
    return 'Sample PDF document content extracted - University Certificate of Achievement';
  } else if (mimeType.includes('image')) {
    return 'Sample image document content extracted - Degree Certificate from University';
  } else {
    return 'Document content extracted - Professional Certification';
  }
}

// Analyze document content and determine verification status
function analyzeDocumentContent(text: string, filename: string): {
  status: string;
  explanation: string;
  confidence: number;
} {
  const text_lower = text.toLowerCase();
  const filename_lower = filename.toLowerCase();
  
  // Simple keyword-based analysis (in production, use more sophisticated AI)
  const educationKeywords = ['university', 'college', 'degree', 'certificate', 'diploma', 'graduation'];
  const suspiciousKeywords = ['fake', 'copy', 'template', 'sample'];
  
  let educationScore = 0;
  let suspiciousScore = 0;
  
  educationKeywords.forEach(keyword => {
    if (text_lower.includes(keyword) || filename_lower.includes(keyword)) {
      educationScore++;
    }
  });
  
  suspiciousKeywords.forEach(keyword => {
    if (text_lower.includes(keyword) || filename_lower.includes(keyword)) {
      suspiciousScore++;
    }
  });
  
  let status = 'pending';
  let explanation = 'Document is being processed for verification.';
  let confidence = 50;
  
  if (suspiciousScore > 0) {
    status = 'suspicious';
    explanation = 'Document contains suspicious elements that require manual review.';
    confidence = 30;
  } else if (educationScore >= 2) {
    status = 'verified';
    explanation = 'Document appears to be a legitimate educational credential.';
    confidence = 85;
  } else if (educationScore >= 1) {
    status = 'verified';
    explanation = 'Document appears to be a valid professional document.';
    confidence = 70;
  } else {
    status = 'failed';
    explanation = 'Document does not contain recognizable credential information.';
    confidence = 20;
  }
  
  return { status, explanation, confidence };
}
