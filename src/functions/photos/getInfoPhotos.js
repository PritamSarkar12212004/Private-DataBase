import uniqid from "uniqid";
import ThumblineGeneratorPhotos from "../../utils/photos/ThumblineGeneratorPhotos.js";

const getInfoPhotos = async (files) => {
  const infoData = await Promise.all(
    files.map(async (file) => ({
      id: uniqid(),
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      sizeBytes: file.size,
      sizeKB: (file.size / 1024).toFixed(2),
      thumbnails: await ThumblineGeneratorPhotos(file),
    }))
  );

  return infoData;
};

export default getInfoPhotos;
