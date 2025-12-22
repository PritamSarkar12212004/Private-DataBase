import fs from "fs";
import path from "path";
import AudioPath from "../../const/path/audioPath.js";

const fetchMainAudio = async (userId) => {
  const userRoot = path.join(AudioPath, userId);
  const metaFile = path.join(userRoot, "metadata.json");

  if (!fs.existsSync(userRoot)) {
    return { error: { message: "User audio folder does not exist" } };
  }

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "User has no uploaded audio files" } };
  }

  // READ METADATA
  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

  const audios = Object.values(metaData.audios).map((audio) => ({
    audioId: audio.audioId,
    originalName: audio.originalName,
    sizeKB: audio.sizeKB,
    duration: audio.duration || null,
    publicUrls: audio.publicUrls,
    createdAt: audio.createdAt,
  }));

  return {
    userId,
    totalAudios: audios.length,
    audios,
    owner: metaData.owner,
  };
};

export default fetchMainAudio;
