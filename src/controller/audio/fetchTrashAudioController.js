import fetchTrashAudios from "../../functions/audio/fetchTrashAudios.js";
import idVarification from "../../functions/global/token/idVarification.js";

const fetchTrashAudioController = async (req, res) => {
  if (!req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide Id and PhoneNumber For Authentication",
      status: false,
      data: null,
    });
  }

  const check = await idVarification(req.body.phone, req.body.id);
  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }

  try {
    const audios = await fetchTrashAudios(req.body.id);

    if (audios.error) {
      return res.status(404).json({
        message: audios.error.message,
      });
    }

    return res.status(200).json({
      status: true,
      data: audios,
      message: "Trash Audio Fetch Done",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error From Server in Fetch Trash Audio",
      status: false,
      data: null,
    });
  }
};

export default fetchTrashAudioController;
