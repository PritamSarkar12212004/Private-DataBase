import idVarification from "../../functions/global/token/idVarification.js";
import trashVideos from "../../functions/video/trashVideos.js";

const deleteVideoController = async (req, res) => {
  const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

  if (!req.body.id || !req.body.phone || !req.body.itemId) {
    return res.status(400).json({
      status: false,
      message: "Provide Id, PhoneNumber and Video Id",
      data: null,
    });
  }

  const { id, phone, itemId } = req.body;

  // ID VERIFICATION
  const check = await idVarification(phone, id);
  if (check.error) {
    return res.status(404).json({
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const data = await trashVideos(id, phone, itemId, PUBLIC_BASE_URL);

    if (data.error) {
      return res.status(404).json({
        status: false,
        message: data.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Video moved to trash successfully",
      data,
    });
  } catch (error) {
    console.error("Delete Video Error:", error);
    return res.status(500).json({
      status: false,
      message: "Error From Server in Video Delete",
      data: null,
    });
  }
};

export default deleteVideoController;
