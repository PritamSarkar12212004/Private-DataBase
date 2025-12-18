import fs from "fs";
import path from "path";
import userPath from "../../../const/path/userPath.js";

const INDEX_FILE = path.join(userPath, "index.json");

const idVarification = async (phone, token) => {
  if (!fs.existsSync(INDEX_FILE)) {
    return { error: { message: "User index file not found" } };
  }

  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));

  const storedToken = indexData[String(phone)];

  if (!storedToken) {
    return { error: { message: "User not found with this phone number" } };
  }

  if (String(storedToken).trim() !== String(token).trim()) {
    return { error: { message: "Invalid token for this phone number" } };
  }

  const userPath = path.join(
    userPath,
    `user_${storedToken}`,
    `${storedToken}.json`
  );

  if (!fs.existsSync(userPath)) {
    return { error: { message: "User data file missing" } };
  }

  const data = JSON.parse(fs.readFileSync(userPath, "utf-8"));
  console.log("ID Varification Done ");
  return { data };
};

export default idVarification;
