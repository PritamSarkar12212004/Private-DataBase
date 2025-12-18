import fs from "fs";
import path from "path";
import PhotosPath from "../../const/path/photosPath.js";

const searchAllImg = async (userId) => {
  const userRoot = path.join(PhotosPath, userId);
  const metaFile = path.join(userRoot, "metadata.json");

  if (!fs.existsSync(userRoot)) {
    return { error: { message: "User folder does not exist" } };
  }

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "User has no uploaded images" } };
  }

  // Read metadata
  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

  const images = Object.values(metaData.images).map((img) => ({
    imageId: img.imageId,
    originalName: img.originalName,
    sizeKB: img.sizeKB,
    publicUrls: img.publicUrls,
    createdAt: img.createdAt,
  }));

  return { userId, totalImages: images.length, images, owner: metaData.owner };
};

export default searchAllImg;
