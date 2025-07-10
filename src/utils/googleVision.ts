import { ImageAnnotatorClient } from "@google-cloud/vision";
import { supabase } from "@/integrations/supabase/client";

export const googleVisionService = {
  client: new ImageAnnotatorClient({
    credentials: JSON.parse(process.env.GOOGLE_VISION_CREDENTIALS!),
  }),

  async extractDocumentText(fileUrl: string) {
    const [result] = await this.client.textDetection(fileUrl);
    return result.textAnnotations?.[0]?.description || "";
  },

  async detectTampering(fileUrl: string) {
    const [safeSearch] = await this.client.safeSearchDetection(fileUrl);
    const [webDetection] = await this.client.webDetection(fileUrl);

    return {
      isSuspicious: safeSearch?.spoof || safeSearch?.violence || false,
      matchingWebImages:
        webDetection?.webDetection?.fullMatchingImages?.length || 0,
    };
  },
};
