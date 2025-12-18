import express from "express";
import upload from "../../services/multer/multerConfig.js";
import uploadPhotoController from "../../controller/photos/uploadPhotoController.js";

const router = express.Router();

router.post("/upload", upload.array("files", 10), uploadPhotoController);
export default router;
