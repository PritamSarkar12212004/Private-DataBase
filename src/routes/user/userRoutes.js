import express from "express";
import async_handler from "express-async-handler";
import createUserController from "../../controller/user/createUserController.js";
import getUserDataController from "../../controller/user/getUserDataController.js";
const route = express.Router();
route.post("/create", async_handler(createUserController));
route.post("/get-data", async_handler(getUserDataController));
export default route;
