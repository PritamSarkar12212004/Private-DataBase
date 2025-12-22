import idVarification from "../../functions/global/token/idVarification.js";
import fetchMainAudio from "../../functions/audio/fetchMainAudio.js";

const fetchMainAudioController = async (req, res) => {
  if (!req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide Id and PhoneNumber For Authentication",
      status: false,
      data: null,
    });
  }

  // ID VERIFICATION
  const check = await idVarification(req.body.phone, req.body.id);

  if (check.error) {
    return res.status(404).json({
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const audios = await fetchMainAudio(req.body.id);

    if (audios.error) {
      return res.status(404).json({
        status: false,
        message: audios.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Audio data fetch done",
      data: audios,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error From Server in Audio Fetch",
      data: null,
    });
  }
};

export default fetchMainAudioController;
