import fetchTrashVideos from "../../functions/video/fetchTrashVideos.js";
import idVarification from "../../functions/global/token/idVarification.js";

const fetchTrashVideoController = async (req, res) => {
  const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

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
      status: false,
      data: null,
    });
  }

  try {
    const videos = await fetchTrashVideos(req.body.id, PUBLIC_BASE_URL);

    if (videos.error) {
      return res.status(404).json({
        message: videos.error.message,
        status: false,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      data: videos,
      message: "Trash Video Fetch Done",
    });
  } catch (error) {
    console.error("Fetch Trash Video Error:", error);
    return res.status(500).json({
      message: "Error From Server in Fetch Trash Video",
      status: false,
      data: null,
    });
  }
};

export default fetchTrashVideoController;
