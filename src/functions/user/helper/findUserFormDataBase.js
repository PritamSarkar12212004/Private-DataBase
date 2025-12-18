import fs from "fs";
import path from "path";

const BASE_DB_PATH = "D:/DataBase/users";
const INDEX_FILE = path.join(BASE_DB_PATH, "index.json");

const findUserFormDataBase = async (phone) => {
  if (!fs.existsSync(INDEX_FILE)) {
    return {
      error: {
        message: "User index file not found",
      },
    };
  }

  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  const userId = indexData[phone];

  if (!userId) {
    return {
      error: {
        message: "User not found with this phone number",
      },
    };
  }

  const userPath = path.join(BASE_DB_PATH, `user_${userId}`, `${userId}.json`);

  if (!fs.existsSync(userPath)) {
    return {
      error: {
        message: "User data file missing",
      },
    };
  }

  const data = JSON.parse(fs.readFileSync(userPath, "utf-8"));
  return { data };
};

export default findUserFormDataBase;
