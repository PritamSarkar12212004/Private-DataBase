const documentFolderMap = (category) => {
  switch (category) {
    case "pdf":
      return "pdf";
    case "doc":
      return "doc";
    case "excel":
      return "excel";
    case "ppt":
      return "ppt";
    case "text":
      return "text";
    case "json":
      return "json";
    default:
      return "other";
  }
};

export default documentFolderMap;
