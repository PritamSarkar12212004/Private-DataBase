import idVarification from "../../functions/global/token/idVarification.js";
import fetchMainVideo from "../../functions/video/fetchMainVideo.js";

const fetchMainVideoController = async (req, res) => {
  if (!req.body.id || !req.body.phone) {
    return res.status(400).json({
      status: false,
      message: "Provide Id and PhoneNumber For Authentication",
      data: null,
    });
  }

  const check = await idVarification(req.body.phone, req.body.id);

  if (check?.error) {
    return res.status(404).json({
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const videos = await fetchMainVideo(req.body.id);

    if (videos?.error) {
      return res.status(404).json({
        status: false,
        message: videos.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Video data fetch done",
      data: videos,
    });
  } catch (error) {
    console.error("Fetch Video Controller Error:", error);
    return res.status(500).json({
      status: false,
      message: "Error From Server in Video Fetch",
      data: null,
    });
  }
};

export default fetchMainVideoController;
