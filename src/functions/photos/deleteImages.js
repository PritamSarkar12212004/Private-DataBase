import fs from "fs";
import path from "path";
import PhotosPath from "../../const/path/photosPath.js";

const deleteFromTrash = async (userId, phone, itemId) => {
  const imageIds = Array.isArray(itemId) ? itemId : [itemId];

  const userRoot = path.join(PhotosPath, userId);
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

  for (const imageId of imageIds) {
    const img = trashMeta.images?.[imageId];

    if (!img) {
      notFound.push(imageId);
      continue;
    }

    // ---------- DELETE ORIGINAL ----------
    const originalPath = path.join(trashRoot, img.paths.original);
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }

    // ---------- DELETE THUMBNAILS ----------
    for (const thumbFile of Object.values(img.paths.thumbnails)) {
      const thumbPath = path.join(trashRoot, "thumbnails", thumbFile);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    // ---------- REMOVE META ----------
    delete trashMeta.images[imageId];
    delete trashIndex[imageId];

    deleted.push(imageId);
  }

  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    userId,
    permanentlyDeleted: deleted.length,
    deletedImages: deleted,
    notFoundImages: notFound,
  };
};

export default deleteFromTrash;
