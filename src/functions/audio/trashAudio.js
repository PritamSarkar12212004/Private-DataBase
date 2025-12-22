import fs from "fs";
import path from "path";
import audioPath from "../../const/path/audioPath.js";

const trashAudio = async (userId, phone, audioIds) => {
  const ids = Array.isArray(audioIds) ? audioIds : [audioIds];

  const userRoot = path.join(audioPath, userId);
  const trashRoot = path.join(userRoot, "trash");

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "User audio metadata not found" } };
  }

  // ensure trash folders
  fs.mkdirSync(path.join(trashRoot, "originals"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "compressed", "q128"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "compressed", "q64"), { recursive: true });

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  // phone safety check
  if (metaData.owner?.userPhone !== phone) {
    return { error: { message: "Phone number mismatch" } };
  }

  const trashMeta = fs.existsSync(trashMetaFile)
    ? JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"))
    : { owner: metaData.owner, audios: {} };

  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  const moved = [];
  const notFound = [];

  for (const audioId of ids) {
    const audio = metaData.audios?.[audioId];
    if (!audio) {
      notFound.push(audioId);
      continue;
    }
    // ---------- ORIGINAL ----------
    if (audio.paths?.original) {
      const srcOriginal = path.join(userRoot, audio.paths.original);
      const destOriginal = path.join(trashRoot, audio.paths.original);
      if (fs.existsSync(srcOriginal)) {
        fs.renameSync(srcOriginal, destOriginal);
      }
    }
    // ---------- COMPRESSED ----------
    if (audio.paths?.compressed) {
      for (const [quality, relPath] of Object.entries(audio.paths.compressed)) {
        if (!relPath) continue;

        const src = path.join(userRoot, relPath);
        const dest = path.join(trashRoot, relPath);

        // ensure folder exists
        fs.mkdirSync(path.dirname(dest), { recursive: true });

        if (fs.existsSync(src)) {
          fs.renameSync(src, dest);
        }
      }
    }

    // ---------- TRASH META ----------
    trashMeta.audios[audioId] = {
      ...audio,
      deletedAt: new Date().toISOString(),
    };

    trashIndex[audioId] = {
      deletedAt: trashMeta.audios[audioId].deletedAt,
      original: audio.publicUrls.original,
    };

    // ---------- REMOVE FROM ACTIVE ----------
    delete metaData.audios[audioId];
    delete indexData[audioId];

    moved.push(audioId);
  }

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    movedToTrash: moved.length,
    movedAudios: moved,
    notFoundAudios: notFound,
  };
};

export default trashAudio;
