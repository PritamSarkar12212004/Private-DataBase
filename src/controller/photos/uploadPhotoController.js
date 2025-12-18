import idVarification from "../../functions/global/token/idVarification.js";
import getInfoPhotos from "../../functions/photos/getInfoPhotos.js";
import saveUploadToDisk from "../../functions/photos/storage/saveUploadToDisk.js";

const uploadPhotoController = async (req, res) => {
  if (!req.files || req.files.length === 0 || !req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide full information for Upload Photos Api",
      status: false,
      data: null,
    });
  }

  // id  varification
  const check = await idVarification(req.body.phone, req.body.id);

  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }
  try {
    const photosInformation = await getInfoPhotos(req.files);
    const savedData = await saveUploadToDisk(
      photosInformation,
      process.env.PUBLIC_BASE_URL,
      check.data
    );
    return res.status(200).json({
      message: "Photos uploaded successfully",
      status: true,
      data: {
        uploadId: savedData.uploadId,
        filesCount: savedData.filesCount,
        files: savedData.files,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error From Server in Photo Upload",
      status: false,
      data: null,
    });
  }
};

export default uploadPhotoController;
