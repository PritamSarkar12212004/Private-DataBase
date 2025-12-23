import fs from "fs";
import path from "path";
import documentPath from "../../const/path/documentPath.js";

const deleteDocumentFromTrash = async (userId, phone, documentId) => {
  const userRoot = path.join(documentPath, userId);
  const trashRoot = path.join(userRoot, "trash");
  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(trashMetaFile)) {
    return { error: { message: "Trash metadata not found" } };
  }

  const trashMeta = JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"));
  const trashIndex = fs.existsSync(trashIndexFile)
    ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8"))
    : {};

  const doc = trashMeta.documents?.[documentId];

  if (!doc) {
    return { error: { message: "Document not found in trash" } };
  }

  // actual file delete
  const originalPath = path.join(trashRoot, doc.paths.original);
  if (fs.existsSync(originalPath)) {
    fs.unlinkSync(originalPath);
  }

  // metadata cleanup
  delete trashMeta.documents[documentId];
  delete trashIndex[documentId];

  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    documentId,
    originalName: doc.originalName,
    deleted: true,
  };
};

export default deleteDocumentFromTrash;
