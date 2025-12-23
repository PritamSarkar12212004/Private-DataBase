import fs from "fs";
import path from "path";
import videoPath from "../../const/path/videoPath.js";


const fetchTrashVideos = async (userId, PUBLIC_BASE_URL) => {
  const makePublicUrl = (userId, relPath) => {
    return `${PUBLIC_BASE_URL}/public/uploads/Video/users/${userId}/trash/${relPath}`;
  };
  const userRoot = path.join(videoPath, userId);
  const trashRoot = path.join(userRoot, "trash");
  const trashMetaFile = path.join(trashRoot, "metadata.json");

  if (!fs.existsSync(trashMetaFile)) {
    return { error: { message: "No trash videos found" } };
  }

  const trashMeta = JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"));

  const videos = {};
  for (const [videoId, video] of Object.entries(trashMeta.videos || {})) {
    const paths = video.paths || {};

    const cleanedPaths = {
      original: paths.original,
      compressed: { ...paths.compressed },
      thumbnails: { ...paths.thumbnails },
    };

    const publicUrls = {
      original: makePublicUrl(userId, cleanedPaths.original),
      compressed: {},
      thumbnails: {},
    };

    for (const [q, relPath] of Object.entries(cleanedPaths.compressed || {})) {
      publicUrls.compressed[q] = makePublicUrl(userId, relPath);
    }

    for (const [q, relPath] of Object.entries(cleanedPaths.thumbnails || {})) {
      publicUrls.thumbnails[q] = makePublicUrl(userId, relPath);
    }

    videos[videoId] = {
      ...video,
      paths: cleanedPaths,
      publicUrls,
    };
  }

  return { videos };
};

export default fetchTrashVideos;
