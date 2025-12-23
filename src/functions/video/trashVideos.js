import fs from "fs";
import path from "path";
import videoPath from "../../const/path/videoPath.js";

const trashVideos = async (userId, phone, videoIds) => {
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds];

  const userRoot = path.join(videoPath, userId);
  const trashRoot = path.join(userRoot, "trash");

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "User video metadata not found" } };
  }

  // ✅ ENSURE TRASH FOLDERS
  fs.mkdirSync(path.join(trashRoot, "originals"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "q40"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "q30"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "q20"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "thumbnails"), { recursive: true });

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};


  const trashMeta = fs.existsSync(trashMetaFile)
    ? JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"))
    : { owner: metaData.owner, videos: {} };

  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  const moved = [];
  const notFound = [];

  for (const videoId of ids) {
    const video = metaData.videos?.[videoId];
    if (!video) {
      notFound.push(videoId);
      continue;
    }

    // ---------- ORIGINAL ----------
    if (video.paths?.original) {
      const src = path.join(userRoot, video.paths.original);
      const dest = path.join(trashRoot, video.paths.original);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(src)) fs.renameSync(src, dest);
    }

    // ---------- COMPRESSED ----------
    if (video.paths?.compressed) {
      for (const relPath of Object.values(video.paths.compressed)) {
        if (!relPath) continue;
        const src = path.join(userRoot, relPath);
        const dest = path.join(trashRoot, relPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (fs.existsSync(src)) fs.renameSync(src, dest);
      }
    }

    // ---------- THUMBNAILS ----------
    if (video.thumbnails) {
      for (const relPath of Object.values(video.thumbnails)) {
        if (!relPath) continue;
        const src = path.join(userRoot, relPath);
        const dest = path.join(trashRoot, relPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        if (fs.existsSync(src)) fs.renameSync(src, dest);
      }
    }

    // ---------- TRASH META ----------
    trashMeta.videos[videoId] = {
      ...video,
      deletedAt: new Date().toISOString(),
    };

    trashIndex[videoId] = {
      deletedAt: trashMeta.videos[videoId].deletedAt,
      original: video.publicUrls?.original || null,
    };

    // ---------- REMOVE FROM ACTIVE ----------
    delete metaData.videos[videoId];
    delete indexData[videoId];

    moved.push(videoId);
  }

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    movedToTrash: moved.length,
    movedVideos: moved,
    notFoundVideos: notFound,
  };
};

export default trashVideos;
