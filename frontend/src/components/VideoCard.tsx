import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const VideoCard = ({videoData, videoId}: {videoData: object, videoId: string}) => {
  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/detailform/${videoId}`);
  };

  return (
    <Card
      className="flex flex-col overflow-hidden pb-4 w-full h-full hover:bg-slate-100 hover:scale-105 cursor-pointer transition duration-150 ease-in-out drop-shadow-md active:scale-95"
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
      <Badge className="badge badge-primary">{videoData.host_id.name}</Badge>

      </CardFooter>
    </Card>
  );
};
