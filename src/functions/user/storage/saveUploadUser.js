import fs from "fs";
import path from "path";

const BASE_DB_PATH = "D:/DataBase/users";
const INDEX_FILE = path.join(BASE_DB_PATH, "index.json");

const saveUploadUser = async (userData) => {
  const userDir = path.join(BASE_DB_PATH, `user_${userData.id}`);
  fs.mkdirSync(userDir, { recursive: true });

  // user metadata
  const metaPath = path.join(userDir, `${userData.id}.json`);
  fs.writeFileSync(metaPath, JSON.stringify(userData, null, 2));

  // index logic (phone -> id)
  let indexData = {};
  if (fs.existsSync(INDEX_FILE)) {
    indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  }

  indexData[userData.userPhone] = userData.id;

  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));

  return {
    userId: userData.id,
    basePath: userDir,
  };
};

export default saveUploadUser;
