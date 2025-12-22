import fs from "fs";
import path from "path";
import uniqid from "uniqid";
import compressAudio from "../../../utils/audio/audioCompressor.js";

const AUDIO_ROOT = "D:/DataBase/Uploads/Audio/users";
const saveAudioToDisk = async (files, baseUrl, auth) => {
  const { id, userName, userPhone } = auth;

  const userRoot = path.join(AUDIO_ROOT, id);
  const originalsDir = path.join(userRoot, "originals");
  const q128Dir = path.join(userRoot, "compressed/q128");
  const q64Dir = path.join(userRoot, "compressed/q64");

  // ✅ MUST exist before ffmpeg
  fs.mkdirSync(originalsDir, { recursive: true });
  fs.mkdirSync(q128Dir, { recursive: true });
  fs.mkdirSync(q64Dir, { recursive: true });

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  const metaData = fs.existsSync(metaFile)
    ? JSON.parse(fs.readFileSync(metaFile, "utf-8"))
    : {
        owner: { id, userName, userPhone },
        audios: {},
      };

  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  const publicBase = `${baseUrl}/public/uploads/Audio/users/${id}`;
  const uploaded = [];

  for (const file of files) {
    const audioId = uniqid();
    const ext = path.extname(file.originalname);

    const originalName = `${audioId}${ext}`;
    const originalPath = path.join(originalsDir, originalName);

    fs.renameSync(file.path, originalPath);

    const q128Name = `${audioId}-128${ext}`;
    const q64Name = `${audioId}-64${ext}`;

    const q128Path = path.join(q128Dir, q128Name);
    const q64Path = path.join(q64Dir, q64Name);

    // 🎵 COMPRESS
    await compressAudio(originalPath, q128Path, "128k");
    await compressAudio(originalPath, q64Path, "64k");

    const audioMeta = {
      audioId,
      originalName: file.originalname,
      sizeKB: Math.round(file.size / 1024),
      paths: {
        original: `originals/${originalName}`,
        compressed: {
          q128: `compressed/q128/${q128Name}`,
          q64: `compressed/q64/${q64Name}`,
        },
      },
      publicUrls: {
        original: `${publicBase}/originals/${originalName}`,
        q128: `${publicBase}/compressed/q128/${q128Name}`,
        q64: `${publicBase}/compressed/q64/${q64Name}`,
      },
      createdAt: new Date().toISOString(),
    };

    metaData.audios[audioId] = audioMeta;
    indexData[audioId] = {
      createdAt: audioMeta.createdAt,
      original: audioMeta.publicUrls.original,
    };

    uploaded.push(audioMeta);
  }

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

  return { userId: id, uploadedCount: uploaded.length, audios: uploaded };
};

export default saveAudioToDisk;
