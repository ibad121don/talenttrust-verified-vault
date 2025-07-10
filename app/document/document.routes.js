const express = require("express");
const multer = require("multer");
const path = require("path");
const { extractTextFromFile } = require("./document.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.post("/extract-text", upload.single("image"), extractTextFromFile);

module.exports = router;
