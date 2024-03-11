import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const VideoCard = ({videoData, videoId}: {videoData: object, videoId: string}) => {
  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/detail/${videoId}`);
  };

  console.log(videoData);

  return (
    <Card
      className="video-card flex flex-col overflow-hidden pb-4 w-full h-full cursor-pointer drop-shadow-md"
      onClick={HandleRedirect}
    >
      <img src={videoData.image_url} alt="" className="aspect-video w-full" />
      <CardContent className="pt-2 grid-cols-1 grow pb-3">
        <p className="font-medium">
          {videoData.title}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between py-0">
        <p></p>
      <Badge className="badge badge-primary">{videoData.video_type.name}</Badge>

      </CardFooter>
    </Card>
  );
};
