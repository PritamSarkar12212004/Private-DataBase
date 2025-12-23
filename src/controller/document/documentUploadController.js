import fs from "fs";
import path from "path";
import documentType from "../../const/types/documentType.js";
import extentionFinder from "../../functions/document/extentionFinder.js";
import idVarification from "../../functions/global/token/idVarification.js";
import documentFolderMap from "../../functions/document/documentFolderMap.js";
import documentPath from "../../const/path/documentPath.js";

const documentUploadController = async (req, res) => {
  const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;
  if (!req.files || !req.body.id || !req.body.phone) {
    return res.status(400).json({
      status: false,
      message: "Provide Id, PhoneNumber and Files",
    });
  }

  for (const file of req.files) {
    if (!documentType.includes(file.mimetype)) {
      return res.status(415).json({
        status: false,
        message: `Invalid file type: ${file.originalname}`,
      });
    }
  }

  const { id: userId, phone } = req.body;

  const check = await idVarification(phone, userId);
  if (check.error) {
    return res.status(404).json({ message: check.error.message });
  }

  try {
    const userRoot = path.join(documentPath, userId);
    const metaFile = path.join(userRoot, "metadata.json");
    const indexFile = path.join(userRoot, "index.json");

    fs.mkdirSync(userRoot, { recursive: true });

    const metaData = fs.existsSync(metaFile)
      ? JSON.parse(fs.readFileSync(metaFile, "utf-8"))
      : { owner: { userId, userPhone: phone }, documents: {} };

    const indexData = fs.existsSync(indexFile)
      ? JSON.parse(fs.readFileSync(indexFile, "utf-8"))
      : {};

    const uploaded = [];

    for (const file of req.files) {
      const extInfo = extentionFinder(file);
      const folder = documentFolderMap(extInfo.category);

      const destDir = path.join(userRoot, "originals", folder);
      fs.mkdirSync(destDir, { recursive: true });

      const destPath = path.join(destDir, file.filename);
      fs.renameSync(file.path, destPath);

      const documentId =
        "doc_" + Date.now() + "_" + Math.round(Math.random() * 1e6);

      const relativePath = path
        .relative(userRoot, destPath)
        .replace(/\\/g, "/");

      const viewUrl = `${PUBLIC_BASE_URL}/public/uploads/Documents/users/${userId}/${relativePath}`;

      const downloadUrl = `${PUBLIC_BASE_URL}/doc/api/doc/download/${userId}?path=${encodeURIComponent(
        relativePath
      )}`;
      metaData.documents[documentId] = {
        documentId,
        originalName: file.originalname,
        extension: extInfo.extension,
        category: extInfo.category,
        size: file.size,

        paths: {
          original: relativePath,
        },

        urls: {
          view: viewUrl,
          download: downloadUrl,
        },

        createdAt: new Date().toISOString(),
      };

      indexData[documentId] = {
        name: file.originalname,
        category: extInfo.category,
        view: viewUrl,
        download: downloadUrl,
      };

      uploaded.push(metaData.documents[documentId]);
    }

    fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2));
    fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));

    return res.status(200).json({
      status: true,
      message: "Documents uploaded successfully",
      uploaded,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Server error in document upload",
    });
  }
};

export default documentUploadController;
