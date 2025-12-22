import fs from "fs";
import path from "path";
import videoType from "../../const/types/videoTypes.js";
import idVarification from "../../functions/global/token/idVarification.js";
import videoCompresser from "../../utils/video/videoCompresser.js";
import videoThumbnailGenerator from "../../utils/video/videoThumblineGenerator.js";
import moveFileSafe from "../../utils/video/moveFileSafe.js";
import videoPath from "../../const/path/videoPath.js";
import saveVideoToDisk from "../../functions/video/storage/saveUploadToDisk.js";

const uploadVideoController = async (req, res) => {
  try {
    if (!req.files?.length || !req.body.id || !req.body.phone) {
      return res.status(400).json({ status: false, message: "Missing data" });
    }

    for (const file of req.files) {
      if (!videoType.includes(file.mimetype)) {
        return res
          .status(415)
          .json({ status: false, message: "Invalid video type" });
      }
    }

    const verify = await idVarification(req.body.phone, req.body.id);
    if (verify.error) return res.status(401).json(verify.error);

    const userId = req.body.id;
    const results = [];

    for (const file of req.files) {
      const baseName = path.parse(file.filename).name;
      const userRoot = path.join(videoPath, userId);

      const originalDir = path.join(userRoot, "originals");
      const compressedDir = path.join(userRoot, "compressed");
      const thumbnailsDir = path.join(userRoot, "thumbnails");

      fs.mkdirSync(originalDir, { recursive: true });
      fs.mkdirSync(path.join(compressedDir, "q40"), { recursive: true });
      fs.mkdirSync(path.join(compressedDir, "q30"), { recursive: true });
      fs.mkdirSync(path.join(compressedDir, "q20"), { recursive: true });
      fs.mkdirSync(path.join(thumbnailsDir, "original"), { recursive: true });
      fs.mkdirSync(path.join(thumbnailsDir, "q40"), { recursive: true });
      fs.mkdirSync(path.join(thumbnailsDir, "q30"), { recursive: true });
      fs.mkdirSync(path.join(thumbnailsDir, "q20"), { recursive: true });

      const originalPath = path.join(originalDir, `${baseName}.mp4`);
      await moveFileSafe(file.path, originalPath);

      const thumbnails = await videoThumbnailGenerator(
        originalPath,
        thumbnailsDir,
        baseName
      );

      const compressed = await videoCompresser(originalPath, {
        q40: path.join(compressedDir, "q40", `${baseName}-40.mp4`),
        q30: path.join(compressedDir, "q30", `${baseName}-30.mp4`),
        q20: path.join(compressedDir, "q20", `${baseName}-20.mp4`),
      });

      const saved = await saveVideoToDisk({
        userId,
        auth: verify.data,
        originalName: file.originalname || file.filename,
        originalPath,
        thumbnails,
        compressed,
        baseUrl: process.env.PUBLIC_BASE_URL,
      });

      results.push(saved);
    }

    res.json({ status: true, uploaded: results.length, videos: results });
  } catch (err) {
    console.error("Video Upload Error:", err);
    res.status(500).json({ status: false, message: "Video upload failed" });
  }
};

export default uploadVideoController;
