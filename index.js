import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import http from "http";

// import routes
import photoRoute from "./src/routes/photos/photoRoute.js";
import userRoutes from "./src/routes/user/userRoutes.js";
import audioRoutes from "./src/routes/audio/audioRoutes.js";
import videoRoutes from "./src/routes/video/videoRoutes.js";
import documentRoute from "./src/routes/document/documentRoute.js";

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

// user Routes
app.use("/api/user", userRoutes);

// photos Routes
app.use("/api", photoRoute);

app.use("/audio/api", audioRoutes);
app.use("/video/api", videoRoutes);
app.use("/doc/api", documentRoute);

server.listen(port, () => {
  console.log("Server start at port ", port);
});
