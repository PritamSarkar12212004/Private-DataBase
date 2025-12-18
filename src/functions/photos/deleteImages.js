import fs from "fs";
import path from "path";

const BASE_DB_PATH = "D:/DataBase/Uploads/Photos/users";

const deleteImages = async (id, phone, itemId) => {
  const imageIds = Array.isArray(itemId) ? itemId : [itemId];

  const userRoot = path.join(BASE_DB_PATH, id);
  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");
  if (!fs.existsSync(userRoot)) {
    return { error: { message: "User folder not found" } };
  }

  //  Metadata load
  if (!fs.existsSync(metaFile)) {
    return { error: { message: "metadata.json not found" } };
  }

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

  //  Phone validation (extra safety)
  if (metaData.owner?.userPhone !== phone) {
    return { error: { message: "Phone number mismatch" } };
  }

  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  const deleted = [];
  const notFound = [];

  for (const imageId of imageIds) {
    const img = metaData.images?.[imageId];

    if (!img) {
      notFound.push(imageId);
      continue;
    }

    //  Delete original
    const originalPath = path.join(userRoot, img.paths.original);
    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);

    //  Delete thumbnails
    for (const key of Object.values(img.paths.thumbnails)) {
      const thumbPath = path.join(userRoot, key);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    //  Remove metadata & index
    delete metaData.images[imageId];
    delete indexData[imageId];

    deleted.push(imageId);
  }

  //  Save updated files
  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

  return {
    status: true,
    userId: id,
    deletedCount: deleted.length,
    deletedImages: deleted,
    notFoundImages: notFound,
  };
};

export default deleteImages;
