import fetchMainDocuments from "../../functions/document/fetchMainDocuments.js";
import idVarification from "../../functions/global/token/idVarification.js";

const fetchMainDocumentController = async (req, res) => {
  if (!req.body.id || !req.body.phone) {
    return res.status(400).json({
      message: "Provide Id and PhoneNumber For Authentication",
      status: false,
      data: null,
    });
  }

  // ✅ ID VERIFICATION
  const check = await idVarification(req.body.phone, req.body.id);
  if (check.error) {
    return res.status(404).json({
      status: false,
      message: check.error.message,
      data: null,
    });
  }

  try {
    const documents = await fetchMainDocuments(req.body.id);

    if (documents.error) {
      return res.status(404).json({
        status: false,
        message: documents.error.message,
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Document data fetch done",
      data: documents,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error From Server in Document Fetch",
      data: null,
    });
  }
};

export default fetchMainDocumentController;
