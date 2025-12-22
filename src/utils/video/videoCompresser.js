import { exec } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegPath from "../../const/path/ffmpegPath.js";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const run = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("FFMPEG ERROR:", stderr);
        return reject(stderr);
      }
      resolve(stdout);
    });
  });

const getScale = (q) => {
  if (q === "q40") return "scale=trunc(iw*0.4/2)*2:trunc(ih*0.4/2)*2";
  if (q === "q30") return "scale=trunc(iw*0.3/2)*2:trunc(ih*0.3/2)*2";
  if (q === "q20") return "scale=trunc(iw*0.2/2)*2:trunc(ih*0.2/2)*2";
};

const videoCompresser = async (originalPath, outputs) => {
  const jobs = [];

  for (const [key, output] of Object.entries(outputs)) {
    ensureDir(path.dirname(output));
    const scale = getScale(key);

    const cmd = `"${ffmpegPath}" -y -i "${originalPath}" -vf "${scale}" -c:v libx264 -preset veryfast -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "${output}"`;

    jobs.push(run(cmd));
  }

  await Promise.all(jobs);
  return outputs;
};

export default videoCompresser;
