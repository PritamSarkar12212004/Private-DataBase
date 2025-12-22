import deleteAudioFromTrash from "../../functions/audio/deleteAudioFromTrash.js";
import idVarification from "../../functions/global/token/idVarification.js";

const trashDeleteAudioController = async (req, res) => {
  if (!req.body.id || !req.body.phone || !req.body.itemId) {
    return res.status(400).json({
      message: "Provide Id, PhoneNumber and Audio Id",
      status: false,
      data: null,
    });
  }

  const { id, phone, itemId } = req.body;

  const check = await idVarification(phone, id);
  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }

  try {
    const data = await deleteAudioFromTrash(id, phone, itemId);

    if (data.error) {
      return res.status(404).json({
        message: data.error.message,
      });
    }

    return res.status(200).json({
      status: true,
      data,
      message: "Permanent Delete Action on Audios",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error From Server in Audio Delete",
      status: false,
      data: null,
    });
  }
};

export default trashDeleteAudioController;
