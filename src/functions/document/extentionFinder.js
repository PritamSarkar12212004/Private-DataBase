import path from "path";

/**
 * Extension finder with category
 * @param {Object} file - multer file object
 * @returns {Object}
 */
const extentionFinder = (file) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // document categories
  const map = {
    pdf: [".pdf"],

    word: [".doc", ".docx"],

    excel: [".xls", ".xlsx"],

    ppt: [".ppt", ".pptx"],

    text: [".txt", ".md", ".log"],

    csv: [".csv"],

    json: [".json"],

    xml: [".xml"],

    subtitle: [".srt", ".vtt"],

    archive: [".zip"],

    unknown: [],
  };

  let category = "unknown";

  for (const key in map) {
    if (map[key].includes(ext)) {
      category = key;
      break;
    }
  }

  return {
    extension: ext,
    category,
    isSubtitle: category === "subtitle",
    isConfig: ["json", "xml", "text"].includes(category),
    isArchive: category === "archive",
  };
};

export default extentionFinder;
