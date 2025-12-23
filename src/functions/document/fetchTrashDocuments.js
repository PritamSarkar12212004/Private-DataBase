import fs from "fs";
import path from "path";
import documentPath from "../../const/path/documentPath.js";


const fetchTrashDocuments = async (userId,PUBLIC_BASE_URL) => {
  const userRoot = path.join(documentPath, userId);
  const trashRoot = path.join(userRoot, "trash");
  const trashMetaFile = path.join(trashRoot, "metadata.json");

  if (!fs.existsSync(userRoot)) {
    return { error: { message: "User folder does not exist" } };
  }

  if (!fs.existsSync(trashRoot)) {
    return { error: { message: "Trash folder does not exist" } };
  }

  if (!fs.existsSync(trashMetaFile)) {
    return { error: { message: "Trash is empty" } };
  }

  const trashMeta = JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"));

  const documents = {};
  for (const [docId, doc] of Object.entries(trashMeta.documents || {})) {
    const viewUrl = `${PUBLIC_BASE_URL}/public/uploads/Documents/users/${userId}/trash/${doc.paths.original}`;
const downloadUrl = `${PUBLIC_BASE_URL}/doc/api/doc/download/${userId}?path=${encodeURIComponent(
  `trash/${doc.paths.original}`
)}`;

    documents[docId] = {
      documentId: doc.documentId,
      originalName: doc.originalName,
      extension: doc.extension,
      category: doc.category,
      size: doc.size,
      paths: doc.paths,
      urls: {
        view: viewUrl,
        download: downloadUrl,
      },
      createdAt: doc.createdAt,
      deletedAt: doc.deletedAt,
    };
  }

  return {
    userId,
    total: Object.keys(documents).length,
    documents,
    owner: trashMeta.owner,
  };
};

export default fetchTrashDocuments;
