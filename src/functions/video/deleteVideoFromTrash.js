import fs from "fs";
import path from "path";
import videoPath from "../../const/path/videoPath.js";

const deleteVideoFromTrash = async (userId, phone, itemId) => {
  const videoIds = Array.isArray(itemId) ? itemId : [itemId];

  const userRoot = path.join(videoPath, userId);
  const trashRoot = path.join(userRoot, "trash");

  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(trashRoot)) {
    return { error: { message: "Trash folder not found" } };
  }

  if (!fs.existsSync(trashMetaFile)) {
    return { error: { message: "Trash metadata not found" } };
  }

  const trashMeta = JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"));
  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  // extra safety
  // if (trashMeta.owner?.userPhone !== phone) {
  //   return { error: { message: "Phone number mismatch" } };
  // }

  const deleted = [];
  const notFound = [];

  for (const videoId of videoIds) {
    const video = trashMeta.videos?.[videoId];
    if (!video) {
      notFound.push(videoId);
      continue;
    }

    /* ---------- DELETE ORIGINAL ---------- */
    if (video.paths?.original) {
      const originalPath = path.join(trashRoot, video.paths.original);
      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    }

    /* ---------- DELETE COMPRESSED ---------- */
    if (video.paths?.compressed) {
      for (const qualityPath of Object.values(video.paths.compressed)) {
        const compressedPath = path.join(trashRoot, qualityPath);
        if (fs.existsSync(compressedPath)) fs.unlinkSync(compressedPath);
      }
    }

    /* ---------- DELETE THUMBNAILS ---------- */
    if (video.paths?.thumbnails) {
      for (const thumbPath of Object.values(video.paths.thumbnails)) {
        const thumbnailPath = path.join(trashRoot, thumbPath);
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
      }
    }

    /* ---------- REMOVE META ---------- */
    delete trashMeta.videos[videoId];
    delete trashIndex[videoId];

    deleted.push(videoId);
  }

  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    userId,
    permanentlyDeleted: deleted.length,
    deletedVideos: deleted,
    notFoundVideos: notFound,
  };
};

export default deleteVideoFromTrash;
