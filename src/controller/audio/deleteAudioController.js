import idVarification from "../../functions/global/token/idVarification.js";
import trashAudios from "../../functions/audio/trashAudio.js";
const deleteAudioController = async (req, res) => {
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
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const data = await trashAudios(id, phone, itemId);

    if (data.error) {
      return res.status(404).json({
        status: false,
        message: data.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Audio moved to trash successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error From Server in Audio Delete",
      data: null,
    });
  }
};

export default deleteAudioController;
