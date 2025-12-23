import express from "express";
import asyn_handle from "express-async-handler";
import documentUploadController from "../../controller/document/documentUploadController.js";
import documentMulterConfig from "../../services/multer/documentMulterConfig.js";
import docDonloaderController from "../../controller/document/docDonloaderController.js";
import fetchMainDocumentController from "../../controller/document/fetchMainDocumentController.js";

const router = express.Router();

router.post(
  "/doc/upload",
  documentMulterConfig.array("doc", 200),
  documentUploadController
);
router.post("/doc/fetch/main-doc", asyn_handle(fetchMainDocumentController));
// router.post("/doc/fetch/trash-doc", fetchTrashVideoController);
// router.post("/doc/delete", deleteVideoController);
// router.post("/doc/trash-delete", trashDeleteVideoController);

router.get("/doc/download/:userId", asyn_handle(docDonloaderController));

export default router;
