import fs from "fs";
import path from "path";
import AudioPath from "../../const/path/audioPath.js";

const fetchTrashAudios = async (userId) => {
  const userRoot = path.join(AudioPath, userId);
  const trashRoot = path.join(userRoot, "trash");
  const trashMetaFile = path.join(trashRoot, "metadata.json");

  if (!fs.existsSync(userRoot)) {
    return { error: { message: "User folder does not exist" } };
  }

  if (!fs.existsSync(trashRoot)) {
    return { error: { message: "Trash folder does not exist" } };
  }

  if (!fs.existsSync(trashMetaFile)) {
    return { error: { message: "Trash is empty" } };
  }

  const trashMeta = JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"));

  const audios = Object.values(trashMeta.audios || {}).map((audio) => ({
    audioId: audio.audioId,
    originalName: audio.originalName,
    sizeKB: audio.sizeKB,

    // IMPORTANT: paths structure already fixed
    paths: audio.paths,

    publicUrls: audio.publicUrls,
    createdAt: audio.createdAt,
    deletedAt: audio.deletedAt,
  }));

  return {
    userId,
    totalAudios: audios.length,
    audios,
    owner: trashMeta.owner,
  };
};

export default fetchTrashAudios;
