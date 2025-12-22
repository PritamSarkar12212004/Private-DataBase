import express from "express";
import audioMulterConfig from "../../services/multer/audioMulterConfig.js";
import audioUploadController from "../../controller/audio/audioUploadController.js";
const route = express.Router();
route.post("/upload", audioMulterConfig.array("files", 10),audioUploadController);
export default route;
