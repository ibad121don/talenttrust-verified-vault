const { createWorker } = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const poppler = require("pdf-poppler");
const vision = require("@google-cloud/vision");

// Set Google Vision credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "../../configs/google-credentials.json"
);

// Log Vision config check
console.log("🌐 Checking Google Vision credentials...");
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn("❌ GOOGLE_APPLICATION_CREDENTIALS is NOT set!");
} else {
  console.log(
    "✅ GOOGLE_APPLICATION_CREDENTIALS loaded from:",
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
}

const client = new vision.ImageAnnotatorClient();

async function convertPdfToImages(pdfPath) {
  const outputDir = path.join(__dirname, "temp");
  fs.mkdirSync(outputDir, { recursive: true });

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    page: null,
  };

  await poppler.convert(pdfPath, options);
  const files = fs.readdirSync(outputDir);

  const images = files
    .filter((f) => /^page.*\.png$/.test(f))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    })
    .map((f) => path.join(outputDir, f));

  return { images, outputDir };
}

async function detectStampByText(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath);
    const fullText = result.fullTextAnnotation?.text || "";

    console.log("🧾 Google Vision OCR text for stamp check:\n", fullText);

    const patterns = [
      /official[\s\-]?seal/i,
      /stamp[\s\-]?(no|number)?/i,
      /certified/i,
      /registrar/i,
      /embossed/i,
      /signature/i,
      /authority/i,
    ];

    const foundKeywords = patterns
      .map((regex) => {
        const match = fullText.match(regex);
        return match ? match[0] : null;
      })
      .filter(Boolean);

    return {
      stampVerified: foundKeywords.length > 0,
      foundKeywords,
    };
  } catch (err) {
    console.error("❌ Error in detectStampByText:", err.message);
    return { stampVerified: false, foundKeywords: [] };
  }
}

async function detectStampByObject(imagePath) {
  try {
    const [result] = await client.objectLocalization({
      image: { source: { filename: imagePath } },
    });

    const objects = result.localizedObjectAnnotations || [];

    console.log(
      `📦 Vision detected objects:`,
      objects.map((o) => `${o.name} (${(o.score * 100).toFixed(1)}%)`)
    );

    const keywords = ["stamp", "seal", "logo", "emblem"];

    const matches = objects.filter((obj) =>
      keywords.some((kw) => obj.name.toLowerCase().includes(kw.toLowerCase()))
    );

    return {
      detected: matches.length > 0,
      objects: matches.map((obj) => ({
        name: obj.name,
        confidence: (obj.score * 100).toFixed(1) + "%",
        boundingPoly: obj.boundingPoly,
      })),
    };
  } catch (err) {
    console.error("❌ Error in detectStampByObject:", err.message);
    return { detected: false, objects: [] };
  }
}

async function extractText(filePath) {
  const worker = await createWorker("eng");

  let imagePaths = [];
  let tempDir = null;
  let stampVerified = false;
  let allFoundKeywords = [];
  let fullText = "";
  let detectedObjects = [];

  if (filePath.endsWith(".pdf")) {
    const result = await convertPdfToImages(filePath);
    imagePaths = result.images;
    tempDir = result.outputDir;
  } else {
    imagePaths = [filePath];
  }

  for (const imagePath of imagePaths) {
    try {
      console.log(`🧐 OCR Processing: ${path.basename(imagePath)}`);
      const {
        data: { text },
      } = await worker.recognize(imagePath);
      fullText += text + "\n";

      if (!stampVerified) {
        const textResult = await detectStampByText(imagePath);
        const objectResult = await detectStampByObject(imagePath);

        if (textResult.stampVerified || objectResult.detected) {
          stampVerified = true;
          allFoundKeywords = textResult.foundKeywords;
          detectedObjects = objectResult.objects;

          console.log("✅ Stamp detected in:", imagePath);
          if (detectedObjects.length) {
            console.log("📦 Objects found:", detectedObjects);
          }
        }
      }
    } catch (err) {
      console.error(`❌ Failed to OCR ${imagePath}:`, err);
    }

    if (filePath.endsWith(".pdf")) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }
  }

  await worker.terminate();

  if (tempDir) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (err) {
      console.error("Error removing temp folder:", err);
    }
  }

  return {
    text: fullText.trim(),
    stampVerified,
    foundKeywords: allFoundKeywords,
    objects: detectedObjects,
  };
}

module.exports = { extractText };
