import deleteDocumentFromTrash from "../../functions/document/deleteDocumentFromTrash.js";
import idVarification from "../../functions/global/token/idVarification.js";

const trashDeleteDocumentController = async (req, res) => {
  if (!req.body.id || !req.body.phone || !req.body.itemId) {
    return res.status(400).json({
      message: "Provide Id, PhoneNumber and Document Id",
      status: false,
      data: null,
    });
  }

  const { id, phone, itemId } = req.body;

  // ID verification
  const check = await idVarification(phone, id);
  if (check.error) {
    return res.status(404).json({
      message: check.error.message,
    });
  }

  try {
    const data = await deleteDocumentFromTrash(id, phone, itemId);

    if (data.error) {
      return res.status(404).json({
        message: data.error.message,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Document permanently deleted from trash",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error From Server in Document Permanent Delete",
      status: false,
      data: null,
    });
  }
};

export default trashDeleteDocumentController;
