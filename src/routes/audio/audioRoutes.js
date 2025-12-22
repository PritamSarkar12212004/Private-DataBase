import express from "express";
import audioMulterConfig from "../../services/multer/audioMulterConfig.js";
import audioUploadController from "../../controller/audio/audioUploadController.js";
import fetchMainAudioController from "../../controller/audio/fetchMainAudioController.js";
import deleteAudioController from "../../controller/audio/deleteAudioController.js";
import fetchTrashAudioController from "../../controller/audio/fetchTrashAudioController.js";
import trashDeleteAudioController from "../../controller/audio/trashDeleteAudioController.js";
const route = express.Router();
route.post(
  "/upload",
  audioMulterConfig.array("files", 10),
  audioUploadController
);
route.post("/audio/fetch/main-image", fetchMainAudioController);
route.post("/audio/fetch/trash-image", fetchTrashAudioController);
route.post("/audio/delete", deleteAudioController);
route.post("/audio/trash-delete", trashDeleteAudioController);
export default route;
