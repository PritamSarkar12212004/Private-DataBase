import fs from "fs";
import path from "path";
import uniqid from "uniqid";
import videoPath from "../../../const/path/videoPath.js";

const saveVideoToDisk = async ({
  userId,
  originalName,
  originalPath,
  thumbnails,
  compressed,
  baseUrl, // e.g. http://domain.com/public
}) => {
  const userRoot = path.join(videoPath, userId);

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  const metaData = fs.existsSync(metaFile)
    ? JSON.parse(fs.readFileSync(metaFile, "utf-8"))
    : { videos: {} };

  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  const videoId = uniqid();

  const publicBase = `${baseUrl}/public/uploads/Video/users/${userId}`;

  const videoMeta = {
    videoId,
    originalName,
    paths: {
      original: path.relative(videoPath, originalPath).replace(/\\/g, "/"),
      compressed,
      thumbnails,
    },
    publicUrls: {
      original: `${publicBase}/originals/${path.basename(originalPath)}`,
      compressed: {
        q40: `${publicBase}/compressed/q40/${path.basename(compressed.q40)}`,
        q30: `${publicBase}/compressed/q30/${path.basename(compressed.q30)}`,
        q20: `${publicBase}/compressed/q20/${path.basename(compressed.q20)}`,
      },
      thumbnails: {
        original: `${publicBase}/thumbnails/original/${path.basename(
          thumbnails.original
        )}`,
        q40: `${publicBase}/thumbnails/q40/${path.basename(thumbnails.q40)}`,
        q30: `${publicBase}/thumbnails/q30/${path.basename(thumbnails.q30)}`,
        q20: `${publicBase}/thumbnails/q20/${path.basename(thumbnails.q20)}`,
      },
    },
    createdAt: new Date().toISOString(),
  };

  metaData.videos[videoId] = videoMeta;

  indexData[videoId] = {
    createdAt: videoMeta.createdAt,
    original: videoMeta.publicUrls.original,
  };

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

  return videoMeta;
};

export default saveVideoToDisk;
