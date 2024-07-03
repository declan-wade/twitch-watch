"use client";
import React from "react";
import ReactPlayer from "react-player";
import { saveObjectToCookie } from "@/app/cookies.js";

type VideoPlayerProps = {
  videoID: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoID }) => {
  const [playedSecs, setPlayedSecs] = React.useState({});

  async function handlePause() {
    saveObjectToCookie(
      { video_id: videoID, play_location: playedSecs },
      "twitch-watch",
    );
    console.warn("Saving location:", playedSecs);
  }

  return (
    <ReactPlayer
      url={`https://www.twitch.tv/videos/${videoID}`}
      config={{ twitch: { options: { controls: true } } }}
      onDuration={(e) => console.log(e)}
      onProgress={(e) => setPlayedSecs(e)}
      onPause={handlePause}
    />
  );
};

export default VideoPlayer;
