"use client";
import React from "react";
import VideoPlayer from "@/components/VideoPlayer";
import NavBar from "@/components/NavBar";

export default function Home({ params }: { params: { videoID: string } }) {
  async function handleGetVideos() {}

  React.useEffect(() => {
    handleGetVideos();
  }, []);

  return (
    <>
      <NavBar />
      <main className="container mx-auto flex justify-center mt-8">
        <VideoPlayer videoID={params.videoID} />
      </main>
    </>
  );
}
