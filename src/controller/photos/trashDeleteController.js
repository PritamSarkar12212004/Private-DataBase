import idVarification from "../../functions/global/token/idVarification.js";
import deleteImages from "../../functions/photos/deleteImages.js";

const trashDeleteController = async (req, res) => {
  if (!req.body.id || !req.body.phone || !req.body.itemId) {
    return res.status(400).json({
      message: "Provide Id and PhoneNumber For Authentication And Photos Id",
      status: false,
      data: null,
    });
  }
  const { id, phone, itemId } = await req.body;
  const check = await idVarification(req.body.phone, req.body.id);
  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }
  try {
    // const data = await deleteImages(id, phone, itemId);
    const data = await deleteImages(id, phone, itemId);

    if (data.error) {
      return res.status(404).json({
        message: check.error.message,
      });
    }
    res.status(200).json({
      status: true,
      data: data,
      message: "Delete Action on Photos",
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
export default trashDeleteController;
