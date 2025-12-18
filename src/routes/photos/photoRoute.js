import express from "express";
import upload from "../../services/multer/multerConfig.js";
import uploadPhotoController from "../../controller/photos/uploadPhotoController.js";
import searchAllImgController from "../../controller/photos/searchAllImgController.js";

const router = express.Router();

router.post("/photos/upload", upload.array("files", 10), uploadPhotoController);
router.post("/photos/search-all-img", searchAllImgController);

export default router;
