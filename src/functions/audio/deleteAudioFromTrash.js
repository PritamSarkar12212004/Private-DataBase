import fs from "fs";
import path from "path";
import AudioPath from "../../const/path/audioPath.js";

const deleteAudioFromTrash = async (userId, phone, itemId) => {
  const audioIds = Array.isArray(itemId) ? itemId : [itemId];

  const userRoot = path.join(AudioPath, userId);
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

  // extra safety
  if (trashMeta.owner?.userPhone !== phone) {
    return { error: { message: "Phone number mismatch" } };
  }

  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  const deleted = [];
  const notFound = [];

  for (const audioId of audioIds) {
    const audio = trashMeta.audios?.[audioId];

    if (!audio) {
      notFound.push(audioId);
      continue;
    }

    /* ---------- DELETE ORIGINAL ---------- */
    if (audio.paths?.original) {
      const originalPath = path.join(trashRoot, audio.paths.original);
      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }
    }

    /* ---------- DELETE COMPRESSED ---------- */
    if (audio.paths?.compressed) {
      for (const quality of Object.values(audio.paths.compressed)) {
        const compressedPath = path.join(trashRoot, quality);
        if (fs.existsSync(compressedPath)) {
          fs.unlinkSync(compressedPath);
        }
      }
    }

    /* ---------- REMOVE META ---------- */
    delete trashMeta.audios[audioId];
    delete trashIndex[audioId];

    deleted.push(audioId);
  }

  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    userId,
    permanentlyDeleted: deleted.length,
    deletedAudios: deleted,
    notFoundAudios: notFound,
  };
};

export default deleteAudioFromTrash;
