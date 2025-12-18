import sharp from "sharp";

const ThumblineGeneratorPhotos = async (file) => {
  try {
    const q40 = await sharp(file.path)
      .resize(300, 300, { fit: "cover" })
      .jpeg({ quality: 40 })
      .toBuffer();

    const q30 = await sharp(file.path)
      .resize(300, 300, { fit: "cover" })
      .jpeg({ quality: 30 })
      .toBuffer();

    const q10 = await sharp(file.path)
      .resize(300, 300, { fit: "cover" })
      .jpeg({ quality: 10 })
      .toBuffer();

    return {
      q40,
      q30,
      q10,
    };
  } catch (error) {
    console.log("Thumbnail error:", error);
    return null;
  }
};

export default ThumblineGeneratorPhotos;
