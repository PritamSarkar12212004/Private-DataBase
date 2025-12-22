import multer from "multer";
import path from "path";
import fs from "fs";
import audioType from "../../const/types/audioType.js";

const UPLOAD_ROOT = "D:/DataBase/Uploads/Audio/tmp";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
    cb(null, UPLOAD_ROOT);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (audioType.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only audio files allowed"), false);
};

export default multer({ storage, fileFilter });
