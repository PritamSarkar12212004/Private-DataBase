import fs from "fs";
import path from "path";
import documentPath from "../../const/path/documentPath.js";

const fetchMainDocuments = async (userId) => {
  const userRoot = path.join(documentPath, userId);
  const metaFile = path.join(userRoot, "metadata.json");

  if (!fs.existsSync(metaFile)) {
    return { error: { message: "Document metadata not found" } };
  }

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

  return {
    owner: metaData.owner,
    total: Object.keys(metaData.documents || {}).length,
    documents: metaData.documents || {},
  };
};

export default fetchMainDocuments;
