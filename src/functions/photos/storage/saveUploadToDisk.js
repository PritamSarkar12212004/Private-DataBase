import fs from "fs";
import path from "path";
import uniqid from "uniqid";
import PhotosPath from "../../../const/path/photosPath.js";

const saveUploadToDisk = async (photos, baseUrl, auth) => {
  if (!auth || !auth.id) {
    throw new Error("Unauthorized upload attempt");
  }

  const { id, userName, userPhone } = auth;

  // USER ROOT
  const userRoot = path.join(PhotosPath, id);
  const originalsDir = path.join(userRoot, "originals");
  const thumbsDir = path.join(userRoot, "thumbnails");

  fs.mkdirSync(originalsDir, { recursive: true });
  fs.mkdirSync(thumbsDir, { recursive: true });

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");

  // LOAD EXISTING DATA
  const metaData = fs.existsSync(metaFile)
    ? JSON.parse(fs.readFileSync(metaFile, "utf-8"))
    : {
        owner: { id, userName, userPhone },
        images: {},
      };

  const indexData = fs.existsSync(indexFile)
    ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
    : {};

  const publicBase = `${baseUrl}/public/uploads/Photos/users/${id}`;

  for (const photo of photos) {
    const imageId = uniqid();
    const ext = path.extname(photo.filename);
    const fileName = `${imageId}${ext}`;

    // ORIGINAL
    fs.renameSync(photo.path, path.join(originalsDir, fileName));

    // THUMBNAILS
    const thumbs = {
      q40: `${imageId}-q40.jpg`,
      q30: `${imageId}-q30.jpg`,
      q10: `${imageId}-q10.jpg`,
    };

    fs.writeFileSync(path.join(thumbsDir, thumbs.q40), photo.thumbnails.q40);
    fs.writeFileSync(path.join(thumbsDir, thumbs.q30), photo.thumbnails.q30);
    fs.writeFileSync(path.join(thumbsDir, thumbs.q10), photo.thumbnails.q10);

    const imageMeta = {
      imageId,
      originalName: photo.originalName,
      sizeKB: photo.sizeKB,
      paths: {
        original: `originals/${fileName}`,
        thumbnails: thumbs,
      },
      publicUrls: {
        original: `${publicBase}/originals/${fileName}`,
        thumbnails: {
          q40: `${publicBase}/thumbnails/${thumbs.q40}`,
          q30: `${publicBase}/thumbnails/${thumbs.q30}`,
          q10: `${publicBase}/thumbnails/${thumbs.q10}`,
        },
      },
      createdAt: new Date().toISOString(),
    };

    metaData.images[imageId] = imageMeta;

    indexData[imageId] = {
      createdAt: imageMeta.createdAt,
      original: imageMeta.publicUrls.original,
    };
  }

  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

  return {
    userId: id,
    totalImages: Object.keys(metaData.images).length,
    uploaded: photos.length,
    images: Object.values(indexData),
  };
};

export default saveUploadToDisk;
