import express from "express";
import videoMulterConfig from "../../services/multer/videoMulterConfig.js";
import uploadVideoController from "../../controller/videos/uploadVideoController.js";
import fetchMainVideoController from "../../controller/videos/fetchMainVideoController.js";

const router = express.Router();

router.post(
  "/video/upload",
  videoMulterConfig.array("videos", 10),
  uploadVideoController
);
router.post("/video/fetch/main-video", fetchMainVideoController);
// router.post("/video/fetch/trash-image", fetchTrashImageController);
// router.post("/video/delete", deletePhotosController);
// router.post("/video/trash-delete", trashDeleteController);

export default router;
