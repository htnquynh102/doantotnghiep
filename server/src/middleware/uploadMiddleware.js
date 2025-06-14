const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "didbhtr9w",
  api_key: "143815867328584",
  api_secret: "U5-7qrF8YXmLwTjkIgR7xH3hZzg",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const type = req.body.type || "default";
    const folderMap = {
      event: "event",
      organizer: "organizer",
      user: "user",
      default: "uploads",
    };

    // return {
    //   folder: folderMap[type] || "uploads",
    //   format: file.mimetype.split("/")[1],
    //   resource_type: "auto",
    //   public_id: file.originalname,
    //   use_filename: true,
    //   unique_filename: false,
    // };

    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    const isPDFOrDoc =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    let resourceType = "raw"; // fallback mặc định

    if (isImage) resourceType = "image";
    else if (isVideo) resourceType = "video";
    else if (isPDFOrDoc) resourceType = "raw";

    return {
      folder: folderMap[type] || "uploads",
      format: file.originalname.split(".").pop(), // lấy đuôi file
      resource_type: resourceType,
      public_id: file.originalname,
      use_filename: true,
      unique_filename: false,
      access_mode: "public",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
