import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Video } from "@/types/types";

export const VideoCard = ({ videoData }: { videoData: Video }) => {
  const navigate = useNavigate();

  const HandleRedirect = () => {
    if (videoData) {
      navigate(`/detail/${videoData.id}`);
    }
  };

  return (
    <Card
      className="video-card flex h-full w-full cursor-pointer flex-col overflow-hidden pb-4 drop-shadow-md"
      onClick={HandleRedirect}
    >
      <img src={videoData.image_url} alt="" className="aspect-video w-full" />
      <CardContent className="grow grid-cols-1 pb-3 pt-2">
        <p className="font-medium">{videoData.title}</p>
      </CardContent>
      <CardFooter className="flex justify-between py-0">
        <p></p>
        <Badge className="badge badge-primary">
          {videoData.video_type.name}
        </Badge>
      </CardFooter>
    </Card>
  );
};
