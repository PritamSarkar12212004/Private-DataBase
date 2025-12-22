import express from "express";
import audioMulterConfig from "../../services/multer/audioMulterConfig.js";
import audioUploadController from "../../controller/audio/audioUploadController.js";
import fetchMainAudioController from "../../controller/audio/fetchMainAudioController.js";
const route = express.Router();
route.post(
  "/upload",
  audioMulterConfig.array("files", 10),
  audioUploadController
);
route.post("/audio/fetch/main-image", fetchMainAudioController);
// route.post("/audio/fetch/trash-image", fetchTrashImageController);
// route.post("/audio/delete", deletePhotosController);
// route.post("/audio/trash-delete", trashDeleteController);
export default route;
