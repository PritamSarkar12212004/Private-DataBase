import express from "express";
import documentUploadController from "../../controller/document/documentUploadController.js";
import documentMulterConfig from "../../services/multer/documentMulterConfig.js";

const router = express.Router();

router.post(
  "/video/upload",
  documentMulterConfig.array("videos", 10),
  documentUploadController
);
// router.post("/doc/fetch/main-doc", fetchMainVideoController);
// router.post("/doc/fetch/trash-doc", fetchTrashVideoController);
// router.post("/doc/delete", deleteVideoController);
// router.post("/doc/trash-delete", trashDeleteVideoController);

export default router;
