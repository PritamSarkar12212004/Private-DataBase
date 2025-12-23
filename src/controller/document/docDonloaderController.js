import fs from "fs";
import path from "path";
import docToudloadPath from "../../const/path/docToudloadPath.js";

const docDonloaderController = (req, res) => {
  try {
    const { userId } = req.params;
    const filePath = req.query.path;

    if (!filePath) {
      return res.status(400).json({ message: "File path missing" });
    }

    const absolutePath = path.join(docToudloadPath, "users", userId, filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.download(absolutePath);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Download error" });
  }
};

export default docDonloaderController;
