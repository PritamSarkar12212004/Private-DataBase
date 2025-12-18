import express from "express";
import multerConfig from "../../services/multer/photoMulterConfig.js";
import uploadPhotoController from "../../controller/photos/uploadPhotoController.js";
import fetchMainImageCobtroller from "../../controller/photos/fetchMainImageCobtroller.js";
import deletePhotosController from "../../controller/photos/deletePhotosController.js";
import trashDeleteController from "../../controller/photos/trashDeleteController.js";
import fetchTrashImageController from "../../controller/photos/fetchTrashImageController.js";

const router = express.Router();

router.post(
  "/photos/upload",
  multerConfig.array("files", 10),
  uploadPhotoController
);
router.post("/photos/fetch/main-image", fetchMainImageCobtroller);
router.post("/photos/fetch/trash-image", fetchTrashImageController);
router.post("/photo/delete", deletePhotosController);
router.post("/photo/trash-delete", trashDeleteController);

export default router;
