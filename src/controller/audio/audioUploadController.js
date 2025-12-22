import audioType from "../../const/types/audioType.js";
import saveAudioToDisk from "../../functions/audio/storage/saveAudioToDisk.js";
import idVarification from "../../functions/global/token/idVarification.js";

const audioUploadController = async (req, res) => {
  if (!req.files || req.files.length === 0 || !req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide full information for Upload Photos Api",
      status: false,
      data: null,
    });
  }
  for (const file of req.files) {
    if (!audioType.includes(file.mimetype)) {
      return res.status(415).json({
        status: false,
        message: `Invalid file type: ${file.originalname}`,
        allowed: imageType,
      });
    }
  }

  // id  varification
  const check = await idVarification(req.body.phone, req.body.id);

  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }
  try {
    const savedData = await saveAudioToDisk(
      req.files,
      process.env.PUBLIC_BASE_URL,
      check.data
    );
    return res.status(200).json({
      message: "Audio uploaded successfully",
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
      message: "Error From Server in Audio Upload",
      status: false,
      data: null,
    });
  }
};
export default audioUploadController;
