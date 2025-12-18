import fs from "fs";
import path from "path";
import uniqid from "uniqid";

const BASE_DB_PATH = "D:/DataBase/Uploads/Photos";
const PUBLIC_ROOT = "uploads/Photos";

const saveUploadToDisk = async (photos, userFilePath, baseUrl, auth) => {
  const { id } = await auth;
  const now = new Date();
  const uploadId = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  // Disk path
  const rootDir = path.join(BASE_DB_PATH, userFilePath, "uploads", uploadId);
  const originalDir = path.join(rootDir, "originals");
  const thumbDir = path.join(rootDir, "thumbnails");
  const metaDir = path.join(rootDir, "metadata");

  fs.mkdirSync(originalDir, { recursive: true });
  fs.mkdirSync(thumbDir, { recursive: true });
  fs.mkdirSync(metaDir, { recursive: true });

  // Public URL relative path
  const relativePath = `${PUBLIC_ROOT}/${userFilePath}/uploads/${uploadId}`;

  const savedImages = [];

  for (const photo of photos) {
    const imageId = uniqid();
    const originalName = `${imageId}${path.extname(photo.filename)}`;
    const originalDest = path.join(originalDir, originalName);

    // Move original file
    fs.renameSync(photo.path, originalDest);

    // Save thumbnails
    const q40 = `${imageId}-q40.jpg`;
    const q30 = `${imageId}-q30.jpg`;
    const q10 = `${imageId}-q10.jpg`;

    fs.writeFileSync(path.join(thumbDir, q40), photo.thumbnails.q40);
    fs.writeFileSync(path.join(thumbDir, q30), photo.thumbnails.q30);
    fs.writeFileSync(path.join(thumbDir, q10), photo.thumbnails.q10);

    // Per-image metadata
    const imageMeta = {
      imageId,
      uploadId,
      ownerId: id,
      originalName: photo.originalName,
      sizeKB: photo.sizeKB,
      paths: {
        original: `originals/${originalName}`,
        thumbnails: { q40, q30, q10 },
      },
      publicUrls: {
        original: `${baseUrl}/public/${relativePath}/originals/${originalName}`,
        thumbnails: {
          q40: `${baseUrl}/public/${relativePath}/thumbnails/${q40}`,
          q30: `${baseUrl}/public/${relativePath}/thumbnails/${q30}`,
          q10: `${baseUrl}/public/${relativePath}/thumbnails/${q10}`,
        },
      },
      createdAt: new Date().toISOString(),
    };

    // Save metadata per image
    fs.writeFileSync(
      path.join(metaDir, `${imageId}.json`),
      JSON.stringify(imageMeta, null, 2)
    );

    savedImages.push(imageMeta);
  }

  return {
    uploadId,
    relativePath,
    filesCount: savedImages.length,
    images: savedImages.map((img) => ({
      imageId: img.imageId,
      original: img.publicUrls.original,
    })),
  };
};

export default saveUploadToDisk;
