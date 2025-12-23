import idVarification from "../../functions/global/token/idVarification.js";
import fetchTrashDocuments from "../../functions/document/fetchTrashDocuments.js";

const fetchTrashDocController = async (req, res) => {
  const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

  if (!req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide Id and PhoneNumber for authentication",
      status: false,
      data: null,
    });
  }

  const { id, phone } = req.body;

  // ID verification
  const check = await idVarification(phone, id);
  if (check.error) {
    return res.status(404).json({
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const documents = await fetchTrashDocuments(id, PUBLIC_BASE_URL);

    if (documents.error) {
      return res.status(404).json({
        status: false,
        message: documents.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Trash documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error from server in fetching trash documents",
      data: null,
    });
  }
};

export default fetchTrashDocController;
