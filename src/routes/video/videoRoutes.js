import express from "express";
import videoMulterConfig from "../../services/multer/videoMulterConfig.js";
import uploadVideoController from "../../controller/videos/uploadVideoController.js";
import fetchMainVideoController from "../../controller/videos/fetchMainVideoController.js";
import deleteVideoController from "../../controller/videos/deleteVideoController.js";
import fetchTrashVideoController from "../../controller/videos/fetchTrashVideoController.js";
import trashDeleteVideoController from "../../controller/videos/trashDeleteVideoController.js";

const router = express.Router();

router.post(
  "/video/upload",
  videoMulterConfig.array("videos", 10),
  uploadVideoController
);
router.post("/video/fetch/main-video", fetchMainVideoController);
router.post("/video/fetch/trash-video", fetchTrashVideoController);
router.post("/video/delete", deleteVideoController);
router.post("/video/trash-delete", trashDeleteVideoController);

export default router;
