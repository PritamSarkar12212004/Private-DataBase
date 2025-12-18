import fs from "fs";
import path from "path";
import userPath from "../../../const/path/userPath.js";

const INDEX_FILE = path.join(userPath, "index.json");

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

  const userPath = path.join(userPath, `user_${userId}`, `${userId}.json`);

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
