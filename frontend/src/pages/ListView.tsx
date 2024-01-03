import { VideoCard } from "@/components/VideoCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import axiosClient from "@/axios";

export default function ListView() {
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [videos, setVideos] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/video`)
      .then(({data}) => {
        console.log(data);
        setVideoData(data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error");
      });
  }, []);

  useEffect(() => {
    // This useEffect will run whenever snippetData is updated
    if (videoData) {
      // Update snippetData state
      setVideoData(videoData);

      // Map over the new snippetData and update the snippets state
      setVideos(videoData.map((video) => (
        <VideoCard key={video.id} videoData={video} videoId={video.id}/>
      )));
    }
  }, [videoData]);

  return (
    <div className="container pt-24">

      <Tabs
        defaultValue="account"
        className="flex flex-col justify-center content-center"
      >
        <TabsList className="mx-96 grid grid-cols-4 justify-items-stretch">
          <TabsTrigger
            value="tate"
            className="transition duration-150 ease-in-out"
          >
            Rollo
          </TabsTrigger>
          <TabsTrigger value="tristan">Stirling</TabsTrigger>
          <TabsTrigger value="jwaller">JWaller</TabsTrigger>
          <TabsTrigger value="juel">Juel</TabsTrigger>
        </TabsList>
        <Separator className="my-2" />
        <TabsContent value="jwaller" className="grid grid-cols-4 gap-4">
          {videos.length > 0 ? videos : <p>Loading...</p>}
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>

    </div>
  );
}
