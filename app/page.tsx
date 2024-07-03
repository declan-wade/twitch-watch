"use client";
import React from "react";
import { fetchTwitchUser, nextVideoPage, prevVideoPage } from "./data.js";
import { getObjectFromCookie } from "./cookies.js";
import {
  Card,
  CardFooter,
  CardHeader,
  Image,
  Button,
  Pagination,
  PaginationItem,
  PaginationCursor,
  CircularProgress,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import NavBar from "@/components/NavBar.tsx";
import moment from "moment";

export default function Home() {
  const [videoData, setVideoData] = React.useState<any>(null);
  const [cookieData, setCookieData] = React.useState([]);
  const [page, setPage] = React.useState<number>(0);
  const [cursor, setCursor] = React.useState(null);

  async function handleGetCookie() {
    const outcome = await getObjectFromCookie("twitch-watch");
    console.log(outcome);
    setCookieData(outcome);
  }

  async function handleGetVideos() {
    const response = await fetchTwitchUser();
    setCursor(response.pagination.cursor);
    const outcome = await getObjectFromCookie("twitch-watch");
    const payload = mergeVideoData(outcome, response);
    console.log(payload);
    setVideoData(payload);
  }

  async function nextPage() {
    setPage((prevPage) => prevPage + 1);
    setCookieData(getObjectFromCookie("twitch-watch"));
    const response = await nextVideoPage(cursor);
    setCursor(response.pagination.cursor);
    const payload = mergeVideoData(cookieData, response);
    console.log(payload);
    setVideoData(payload);
  }

  async function prevPage() {
    setPage((prevPage) => prevPage - 1);
    setCookieData(getObjectFromCookie("twitch-watch"));
    const response = await prevVideoPage(cursor);
    setCursor(response.pagination.cursor);
    const payload = mergeVideoData(cookieData, response);
    console.log(payload);
    setVideoData(payload);
  }

  function mergeVideoData(myCookie: any, apiData: any) {
    console.warn("merging...", myCookie, apiData);
    const cookieMap = new Map(
      myCookie.map((item: any) => [item.video_id, item.play_location]),
    );

    console.log(cookieMap); // Debugging line to print the cookieMap

    // Merge the data
    const mergedData = apiData.data.map((video: any) => {
      if (cookieMap.has(video.id)) {
        return {
          ...video,
          play_location: cookieMap.get(video.id),
        };
      }
      return video;
    });

    return mergedData;
  }

  React.useEffect(() => {
    handleGetVideos();
    handleGetCookie();
  }, []);

  return (
    <main className="container mx-auto">
      <NavBar />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
        {videoData &&
          videoData.length > 0 &&
          videoData.map((item: any, index: any) => {
            const width = 320;
            const height = 180;
            const imageUrl = item.thumbnail_url
              .replace("%{width}", width)
              .replace("%{height}", height);
            return (
              <Card
                key={index}
                isFooterBlurred
                radius="lg"
                className="border-none w-fit"
                isPressable
                onPress={() => {
                  const newWindow = window.open(`/watch/${item.id}/`, "_blank");
                  newWindow?.focus();
                }}
                fullWidth={false}
              >
                <CardHeader className=" z-10 top-1 flex-col !items-start">
                  <h4 className="w-72 text-white font-medium text-large">
                    {item.title}
                  </h4>
                </CardHeader>
                <Image
                  alt="Thumbnail"
                  className="object-cover"
                  height={height}
                  src={imageUrl}
                  width={width}
                />
                <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                  {item.play_location ? (
                    <CircularProgress
                      aria-label="Loading..."
                      size="sm"
                      value={Math.round(item.play_location.played * 100)}
                      color="warning"
                      showValueLabel={true}
                    />
                  ) : (
                    <></>
                  )}
                  <p className="text-tiny text-white/80">
                    {moment(item.created_at).format("DD MMMM")} -{" "}
                    {item.duration}
                  </p>
                  <Button
                    className="text-tiny text-white bg-black/20"
                    variant="flat"
                    color="default"
                    radius="lg"
                    size="sm"
                  >
                    View
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
      {videoData ? (
        <div className="flex m-3 gap-3 justify-center">
          <Button
            color={"primary"}
            isDisabled={page == 0}
            onClick={() => prevPage()}
          >
            Back
          </Button>
          <Button
            color={"primary"}
            isDisabled={videoData.length < 20}
            onClick={() => nextPage()}
          >
            Next
          </Button>
        </div>
      ) : (
        <></>
      )}
    </main>
  );
}
