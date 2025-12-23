import fs from "fs";
import path from "path";
import videoPath from "../../const/path/videoPath.js";

const fetchMainVideo = async (userId) => {
  try {
    const userRoot = path.join(videoPath, userId);
    const metaFile = path.join(userRoot, "metadata.json");

    if (!fs.existsSync(userRoot)) {
      return { error: { message: "User video folder does not exist" } };
    }
    if (!fs.existsSync(metaFile)) {
      return { error: { message: "User has no uploaded videos" } };
    }

    const metaData = JSON.parse(fs.readFileSync(metaFile, "utf-8"));

    const videos = Object.values(metaData.videos).map((video) => ({
      videoId: video.videoId,
      originalName: video.originalName,
      sizeKB: video.sizeKB,
      duration: video.duration || null,
      publicUrls: video.publicUrls,
      createdAt: video.createdAt,
    }));

    return {
      userId,
      totalVideos: videos.length,
      videos,
      owner: metaData.owner,
    };
  } catch (error) {
    console.error("Fetch Video Function Error:", error);
    return { error: { message: "Failed to read video metadata" } };
  }
};

export default fetchMainVideo;
