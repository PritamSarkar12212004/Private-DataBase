import fs from "fs";
import path from "path";
import PhotosPath from "../../../const/path/photosPath.js";

const trashPhotos = async (userId, phone, imageIds) => {
  const ids = Array.isArray(imageIds) ? imageIds : [imageIds];

  const userRoot = path.join(PhotosPath, userId);
  const trashRoot = path.join(userRoot, "trash");

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "User metadata not found" } };
  }

  // ensure trash folders
  fs.mkdirSync(path.join(trashRoot, "originals"), { recursive: true });
  fs.mkdirSync(path.join(trashRoot, "thumbnails"), { recursive: true });

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  // phone validation (extra safety)
  if (metaData.owner?.userPhone !== phone) {
    return { error: { message: "Phone number mismatch" } };
  }

  const trashMeta = fs.existsSync(trashMetaFile)
    ? JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"))
    : { owner: metaData.owner, images: {} };

  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  const moved = [];
  const notFound = [];

  for (const imageId of ids) {
    const img = metaData.images?.[imageId];
    if (!img) {
      notFound.push(imageId);
      continue;
    }

    // ---------- ORIGINAL ----------
    const srcOriginal = path.join(userRoot, img.paths.original);
    const destOriginal = path.join(trashRoot, img.paths.original);

    if (fs.existsSync(srcOriginal)) {
      fs.renameSync(srcOriginal, destOriginal);
    }

    // ---------- THUMBNAILS ----------
    for (const thumbFile of Object.values(img.paths.thumbnails)) {
      const srcThumb = path.join(userRoot, "thumbnails", thumbFile);
      const destThumb = path.join(trashRoot, "thumbnails", thumbFile);

      if (fs.existsSync(srcThumb)) {
        fs.renameSync(srcThumb, destThumb);
      }
    }

    // ---------- TRASH META ----------
    trashMeta.images[imageId] = {
      ...img,
      deletedAt: new Date().toISOString(),
    };

    trashIndex[imageId] = {
      deletedAt: trashMeta.images[imageId].deletedAt,
      original: img.publicUrls.original,
    };

    // ---------- REMOVE FROM ACTIVE ----------
    delete metaData.images[imageId];
    delete indexData[imageId];

    moved.push(imageId);
  }

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    movedToTrash: moved.length,
    movedImages: moved,
    notFoundImages: notFound,
  };
};

export default trashPhotos;
