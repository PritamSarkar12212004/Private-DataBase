import multer from "multer";
import path from "path";
import fs from "fs";
import imageType from "../../const/types/imageType.js";
import uploadPath from "../../const/path/uploadPath.js";


const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const todayFolder = `${uploadPath}/${
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
  if (imageType.includes(file.mimetype)) {
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
