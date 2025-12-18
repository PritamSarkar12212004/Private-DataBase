import multer from "multer";
import path from "path";
import fs from "fs";

const DATABASE_PATH = "D:/DataBase/uploads";

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "application/pdf",
  "audio/mpeg",
  "video/mp4",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const todayFolder = `${DATABASE_PATH}/${
      new Date().toISOString().split("T")[0]
    }`;
    createFolderIfNotExists(todayFolder);

    cb(null, todayFolder);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(" Invalid file type! Upload proper file."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10000 * 1024 * 1024,
  },
});

export default upload;
