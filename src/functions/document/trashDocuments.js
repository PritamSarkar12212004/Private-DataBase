import fs from "fs";
import path from "path";
import documentPath from "../../const/path/documentPath.js";

const trashDocuments = async (userId, phone, docIds) => {
  const ids = Array.isArray(docIds) ? docIds : [docIds];
  const userRoot = path.join(documentPath, userId);
  const trashRoot = path.join(userRoot, "trash");

  const metaFile = path.join(userRoot, "metadata.json");
  const indexFile = path.join(userRoot, "index.json");
  const trashMetaFile = path.join(trashRoot, "metadata.json");
  const trashIndexFile = path.join(trashRoot, "index.json");

  if (!fs.existsSync(metaFile)) return { error: { message: "Metadata not found" } };
  if (!fs.existsSync(trashRoot)) fs.mkdirSync(trashRoot, { recursive: true });

  const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
  const indexData = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, "utf-8")) : {};

  // Extra safety
  if (metaData.owner?.userPhone !== phone) return { error: { message: "Phone number mismatch" } };

  const trashMeta = fs.existsSync(trashMetaFile)
    ? JSON.parse(fs.readFileSync(trashMetaFile, "utf-8"))
    : { owner: metaData.owner, documents: {} };
  const trashIndex = fs.existsSync(trashIndexFile) ? JSON.parse(fs.readFileSync(trashIndexFile, "utf-8")) : {};

  const moved = [];
  const notFound = [];

  for (const docId of ids) {
    const doc = metaData.documents?.[docId];
    if (!doc) {
      notFound.push(docId);
      continue;
    }

    // Move file
    if (doc.paths?.original) {
      const src = path.join(userRoot, doc.paths.original);
      const dest = path.join(trashRoot, doc.paths.original);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fs.existsSync(src)) fs.renameSync(src, dest);
    }

    // Update trash meta
    trashMeta.documents[docId] = {
      ...doc,
      deletedAt: new Date().toISOString(),
    };

    trashIndex[docId] = {
      deletedAt: trashMeta.documents[docId].deletedAt,
      original: doc.publicUrl,
    };

    // Remove from main
    delete metaData.documents[docId];
    delete indexData[docId];

    moved.push(docId);
  }

  // Save
  fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
  fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
  fs.writeFileSync(trashMetaFile, JSON.stringify(trashMeta, null, 2));
  fs.writeFileSync(trashIndexFile, JSON.stringify(trashIndex, null, 2));

  return {
    status: true,
    movedDocuments: moved,
    notFoundDocuments: notFound,
    movedToTrash: moved.length,
  };
};

export default trashDocuments;
