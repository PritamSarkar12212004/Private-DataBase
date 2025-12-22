import multer from "multer";
import path from "path";
import fs from "fs";
import videoType from "../../const/types/videoTypes.js";
import videoTemPath from "../../const/path/temp/videoTemPath.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(videoTemPath, { recursive: true });
    cb(null, videoTemPath);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (videoType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"), false);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB (adjust if needed)
  },
});
