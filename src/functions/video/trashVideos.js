import fs from "fs";
import path from "path";
import videoPath from "../../const/path/videoPath.js";

const trashVideos = async (userId, phone, videoIds, PUBLIC_BASE_URL) => {
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

  //  Ensure trash folders
  fs.mkdirSync(path.join(trashRoot, "originals"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "compressed", "q40"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "compressed", "q30"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "compressed", "q20"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "thumbnails", "original"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(trashRoot, "thumbnails", "q40"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "thumbnails", "q30"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "thumbnails", "q20"), { recursive: true });

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

  const makeTrashUrl = (userId, relPath) =>
    `${PUBLIC_BASE_URL}/public/uploads/Video/users/${userId}/trash/${relPath.replace(
      /\\/g,
      "/"
    )}`;

  for (const videoId of ids) {
    const video = metaData.videos?.[videoId];
    if (!video) {
      notFound.push(videoId);
      continue;
    }

    // ---------- MOVE FILES ----------
    const cleanedPaths = {
      original: "",
      compressed: {},
      thumbnails: {},
    };

    // Original
    if (video.paths?.original) {
      const src = path.join(videoPath, video.paths.original);
      const dest = path.join(
        trashRoot,
        video.paths.original.replace(`${userId}/`, "")
      ); // Trash me userId folder ke under
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(src)) fs.renameSync(src, dest);
      cleanedPaths.original = path
        .relative(trashRoot, dest)
        .replace(/\\/g, "/");
    }

    // Compressed
    for (const [q, relPath] of Object.entries(video.paths?.compressed || {})) {
      const src = path.join(videoPath, relPath);
      const dest = path.join(trashRoot, relPath.replace(`${userId}/`, ""));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(src)) fs.renameSync(src, dest);
      cleanedPaths.compressed[q] = path
        .relative(trashRoot, dest)
        .replace(/\\/g, "/");
    }

    // Thumbnails
    for (const [q, relPath] of Object.entries(video.paths?.thumbnails || {})) {
      const src = path.join(videoPath, relPath);
      const dest = path.join(trashRoot, relPath.replace(`${userId}/`, ""));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(src)) fs.renameSync(src, dest);
      cleanedPaths.thumbnails[q] = path
        .relative(trashRoot, dest)
        .replace(/\\/g, "/");
    }

    // ---------- BUILD TRASH META ----------
    const trashPublicUrls = {
      original: makeTrashUrl(userId, cleanedPaths.original),
      compressed: {},
      thumbnails: {},
    };

    for (const [q, p] of Object.entries(cleanedPaths.compressed)) {
      trashPublicUrls.compressed[q] = makeTrashUrl(userId, p);
    }

    for (const [q, p] of Object.entries(cleanedPaths.thumbnails)) {
      trashPublicUrls.thumbnails[q] = makeTrashUrl(userId, p);
    }

    trashMeta.videos[videoId] = {
      videoId: video.videoId,
      originalName: video.originalName,
      paths: cleanedPaths,
      publicUrls: trashPublicUrls,
      createdAt: video.createdAt,
      deletedAt: new Date().toISOString(),
    };

    trashIndex[videoId] = {
      deletedAt: trashMeta.videos[videoId].deletedAt,
      original: trashPublicUrls.original,
    };

    // ---------- REMOVE FROM ACTIVE ----------
    delete metaData.videos[videoId];
    delete indexData[videoId];

    moved.push(videoId);
  }

  // Save all
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
