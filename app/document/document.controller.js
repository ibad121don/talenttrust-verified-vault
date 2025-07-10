const { extractText } = require("./document.service");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// 🔍 Helper to check if strict verification is required
const requiresStrictVerification = (category) => {
  const stampRequiredCategories = [
    "degree",
    "certificate",
    "transcript",
    "birth_certificate",
    "marriage_certificate",
    "tax_document",
    "medical_record",
    "insurance_document",
  ];
  return stampRequiredCategories.includes(category);
};

exports.extractTextFromFile = async (req, res) => {
  try {
    let filePath;
    const tempDir = path.join(__dirname, "..", "temp");
    fs.mkdirSync(tempDir, { recursive: true });

    // 📂 Case 1: File Upload
    if (req.file) {
      filePath = req.file.path;
    }
    // 🌐 Case 2: URL Download
    else if (req.body.url) {
      const url = req.body.url;
      const urlPath = new URL(url).pathname;
      let ext = path.extname(urlPath).toLowerCase();
      if (
        !ext ||
        ![".pdf", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"].includes(
          ext
        )
      ) {
        ext = ".jpg";
      }
      const tempFilePath = path.join(tempDir, `downloaded-${Date.now()}${ext}`);
      const writer = fs.createWriteStream(tempFilePath);

      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
      });

      await new Promise((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      filePath = tempFilePath;
    } else {
      return res.status(400).json({
        message: "Either file upload or image/PDF URL is required.",
      });
    }

    console.log(`🔍 Starting OCR for: ${filePath}`);

    // 🔎 Extract text + stamp + signature + object data
    const {
      text,
      stampVerified,
      signatureVerified,
      foundKeywords,
      objects = [],
    } = await extractText(filePath);

    // Cleanup temporary downloaded file (non-PDFs only)
    if (fs.existsSync(filePath) && !filePath.endsWith(".pdf")) {
      fs.unlink(filePath, (err) => {
        if (err) console.warn("⚠️ Could not delete downloaded file:", filePath);
      });
    }

    // 🧠 Parse extracted text for known fields
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let name = null;
    let institution = null;
    let dateOfIssue = null;
    let registrationNumber = null;

    for (const rawLine of lines) {
      const line = rawLine.replace(/[©®@°+]/g, "").trim();

      if (!name && /^(full\s*)?name[:\-]/i.test(line)) {
        name = line.split(/[:\-]/)[1]?.trim();
      }

      if (!name && line.toLowerCase().includes("candidate name")) {
        name = line.split(/[:\-]/)[1]?.trim();
      }

      if (
        !institution &&
        /(institution|university|college|school|institute)[:\-]/i.test(line)
      ) {
        institution = line.split(/[:\-]/)[1]?.trim() || line;
      }

      if (!dateOfIssue) {
        if (
          line.toLowerCase().includes("date of issue") ||
          line.toLowerCase().includes("issued on")
        ) {
          const match = line.match(
            /((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})|(\d{2}[-/]\d{2}[-/]\d{4})|(\d{4}[-/]\d{2}[-/]\d{2})/
          );
          dateOfIssue = match?.[0] || null;
        }
      }

      if (
        !registrationNumber &&
        /(registration number|reg.? no|enrollment|roll no)/i.test(line)
      ) {
        const match = line.match(/[:\-]\s*(.+)$/);
        registrationNumber = match?.[1]?.trim() || line;
      }
    }

    // 🔁 Fallback for institution name in top lines
    if (!institution) {
      const topLines = lines.slice(0, 5);
      for (const topLine of topLines) {
        const lower = topLine.toLowerCase();
        if (
          lower.includes("university") ||
          lower.includes("institute") ||
          lower.includes("college") ||
          lower.includes("school") ||
          lower.includes("academy")
        ) {
          institution = topLine.trim();
          break;
        }
      }
    }

    // 🧠 Category-based verification logic
    const category = req.body.category?.toLowerCase() || "other";
    const requiresStrict = requiresStrictVerification(category);

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!institution && requiresStrict) missingFields.push("institution");
    if (!dateOfIssue && requiresStrict) missingFields.push("dateOfIssue");
    if (!registrationNumber && requiresStrict)
      missingFields.push("registrationNumber");

    const isFake =
      (requiresStrict &&
        (missingFields.length > 0 || !stampVerified || !signatureVerified)) ||
      (!requiresStrict && missingFields.length > 2);

    // ✅ Score calculation
    let score = 0;
    if (name) score += 30;
    if (institution) score += 25;
    if (dateOfIssue) score += 15;
    if (registrationNumber) score += 15;
    if (stampVerified && requiresStrict) score += 10;
    if (signatureVerified && requiresStrict) score += 10;
    if (foundKeywords.length > 0) score += 5;
    if (objects.length > 0) score += 5;
    if (score > 100) score = 100;

    return res.status(200).json({
      message: "Text extracted successfully.",
      raw: text,
      extracted: {
        name: name || "Not Found",
        institution: institution || "Not Found",
        dateOfIssue: dateOfIssue || "Not Found",
        registrationNumber: registrationNumber || "Not Found",
      },
      stamp: stampVerified ? "Detected ✅" : "Not Detected ❌",
      signature: signatureVerified ? "Detected ✅" : "Not Detected ❌",
      keywords: foundKeywords,
      objects,
      score: `${score}%`,
      result: isFake
        ? `⚠️ ${
            requiresStrict ? "Fake Document" : "Incomplete Document"
          } - Missing: ${missingFields.join(", ")}${
            requiresStrict && !stampVerified ? ", stamp" : ""
          }${requiresStrict && !signatureVerified ? ", signature" : ""}`
        : `✅ Verified${
            requiresStrict ? " - All checks passed" : " (Basic checks passed)"
          }`,
    });
  } catch (error) {
    console.error("❌ OCR Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
