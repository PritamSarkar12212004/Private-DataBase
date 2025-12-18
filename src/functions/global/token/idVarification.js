import fs from "fs";
import path from "path";
import USERS_ROOT from "../../../const/path/userPath.js";

const INDEX_FILE = path.join(USERS_ROOT, "index.json");

const idVarification = async (phone, token) => {
  //  index.json exist check
  if (!fs.existsSync(INDEX_FILE)) {
    return { error: { message: "User index file not found" } };
  }

  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));

  //  phone → token mapping
  const storedToken = indexData[String(phone)];

  if (!storedToken) {
    return { error: { message: "User not found with this phone number" } };
  }

  //  token match
  if (String(storedToken).trim() !== String(token).trim()) {
    return { error: { message: "Invalid token for this phone number" } };
  }

  //  user file path
  const userFilePath = path.join(
    USERS_ROOT,
    `user_${storedToken}`,
    `${storedToken}.json`
  );

  if (!fs.existsSync(userFilePath)) {
    return { error: { message: "User data file missing" } };
  }

  // read user data
  const data = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

  console.log(" ID Verification Done:", data.id);

  return { data };
};

export default idVarification;
