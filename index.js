import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import http from "http";

import photoRoute from "./src/routes/photos/photoRoute.js";
import userRoutes from "./src/routes/user/userRoutes.js";

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/public", express.static("D:/DataBase"));
app.use("/api/user", userRoutes);
app.use("/api", photoRoute);

server.listen(port, () => {
  console.log("Server start at port ", port);
});
