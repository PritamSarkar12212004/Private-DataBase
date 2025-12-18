import fs from "fs";
import path from "path";
import PhotosPath from "../../const/path/photosPath.js";

const fetchTrashImages = async (userId) => {
  const userRoot = path.join(PhotosPath, userId);
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

  const images = Object.values(trashMeta.images || {}).map((img) => ({
    imageId: img.imageId,
    originalName: img.originalName,
    sizeKB: img.sizeKB,
    publicUrls: img.publicUrls,
    createdAt: img.createdAt,
    deletedAt: img.deletedAt,
  }));

  return {
    userId,
    totalImages: images.length,
    images,
    owner: trashMeta.owner,
  };
};

export default fetchTrashImages;
