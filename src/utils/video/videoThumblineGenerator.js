import { exec } from "child_process";
import path from "path";
import fs from "fs";
import ffmpegPath from "../../const/path/ffmpegPath.js";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const generateThumbnail = (input, output, scale) => {
  return new Promise((resolve, reject) => {
    const cmd = `"${ffmpegPath}" -y -ss 00:00:01 -i "${input}" -frames:v 1 -vf "scale=${scale}" "${output}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("FFMPEG ERROR:", stderr);
        return reject(err);
      }
      resolve(output);
    });
  });
};

const videoThumbnailGenerator = async (videoPath, thumbRoot, baseName) => {
  const dirs = ["original", "q40", "q30", "q20"].map((d) => path.join(thumbRoot, d));
  dirs.forEach(ensureDir);

  return {
    original: await generateThumbnail(
      videoPath,
      path.join(thumbRoot, "original", `${baseName}.jpg`),
      "iw:ih"
    ),
    q40: await generateThumbnail(
      videoPath,
      path.join(thumbRoot, "q40", `${baseName}.jpg`),
      "iw*0.4:ih*0.4"
    ),
    q30: await generateThumbnail(
      videoPath,
      path.join(thumbRoot, "q30", `${baseName}.jpg`),
      "iw*0.3:ih*0.3"
    ),
    q20: await generateThumbnail(
      videoPath,
      path.join(thumbRoot, "q20", `${baseName}.jpg`),
      "iw*0.2:ih*0.2"
    ),
  };
};

export default videoThumbnailGenerator;
