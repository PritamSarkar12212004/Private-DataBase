import idVarification from "../../functions/global/token/idVarification.js";
import fetchTrashImages from "../../functions/photos/fetchTrashImage.js";

const fetchTrashImageController = async (req, res) => {
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
    const photos = await fetchTrashImages(req.body.id);
    if (photos.error) {
      return res.status(404).json({
        message: check.error.message,
      });
    }

    res.status(200).json({
      status: true,
      data: photos,
      message: "Data Fetch Done",
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
export default fetchTrashImageController;
