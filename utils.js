const cloudinary = require("./configs/cloudinary-config");
const jwt = require("jsonwebtoken");
const admin = require("./configs/firebase-config");
const fs = require("fs");
const path = require("path");
const PImage = require("pureimage");
const { v4: uuidv4 } = require("uuid");

// Helper function to upload files to Cloudinary
exports.uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    let resourceType = "auto";
    cloudinary.uploader
      .upload_stream(
        { folder: folder, resource_type: resourceType },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(file.buffer);
  });
};

// exports.generateToken = (Key) => {
//   return jwt.sign({ Key }, process.env.JWT_SECRET_KEY);
// };
exports.generateToken = (email, expiresIn = "1d") => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn });
};

exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

exports.getPagination = ({ page, limit }) => {
  // Pagination logic
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return { pageNumber, pageSize, startIndex, endIndex };
};

exports.sendNotification = async ({ token, payload }) => {
  try {
    // Send the notification using Firebase Admin SDK
    const response = await admin.messaging().send({
      token: token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        ...payload.data,
      },
    });

    // Log and return success response
    return { success: true, response }; // Return success response as an object
  } catch (error) {
    // Log and return error response
    console.error("Error sending notification:", error);
    return { success: false, error: error.message }; // Return error with success status as false
  }
};

exports.generateInitialsImage = async (fullName) => {
  const initials = fullName
    .split(" ")
    .map((name) => name[0].toUpperCase())
    .join("");

  const width = 200;
  const height = 200;
  const image = PImage.make(width, height);
  const ctx = image.getContext("2d");

  ctx.fillStyle = "#6366f1"; // Indigo
  ctx.fillRect(0, 0, width, height);

  try {
    ctx.fillStyle = "#ffffff";
    ctx.font = "40pt Arial";
    const textWidth = ctx.measureText(initials).width;
    ctx.fillText(initials, (width - textWidth) / 2, height / 2 + 15);
  } catch (err) {
    console.warn("Font rendering failed:", err.message);
  }

  // Ensure uploads folder exists
  const uploadsDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${uuidv4()}.png`;
  const filePath = path.join(uploadsDir, fileName);

  console.log("Saving image to path:", filePath);
  await PImage.encodePNGToStream(image, fs.createWriteStream(filePath));

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "profile_pic",
    public_id: initials + "-" + uuidv4().slice(0, 5),
  });

  fs.unlinkSync(filePath);

  return result.secure_url;
};

exports.calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

exports.safeParse = (value) => {
  try {
    return typeof value === "string" ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};
