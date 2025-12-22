import { execFile } from "child_process";
import ffmpegPath from "../../const/path/ffmpegPath.js";
import fs from 'fs'
import path from "path";
const compressAudio = (input, output, bitrate) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(output), { recursive: true });

    execFile(
      ffmpegPath,
      ["-y", "-i", input, "-b:a", bitrate, output],
      (error) => {
        if (error) {
          console.error("FFmpeg Error:", error);
          return reject(error);
        }
        resolve(true);
      }
    );
  });
};
export default compressAudio