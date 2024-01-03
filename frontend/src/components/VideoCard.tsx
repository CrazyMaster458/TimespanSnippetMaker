import { Card, CardContent } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const VideoCard = ({videoData, videoId}: {videoData: object, videoId: string}) => {
  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/detailform/${videoId}`);
  };

  return (
    <Card
      className="overflow-hidden w-full h-full hover:bg-slate-100 hover:scale-105 cursor-pointer transition duration-150 ease-in-out drop-shadow-md active:scale-95"
      onClick={HandleRedirect}
    >
      <img src={videoData.image_url} alt="" className="aspect-video w-full" />
      <CardContent className="pt-2">
        <p className="font-medium">
          {videoData.title}
        </p>
        <div className="card-actions justify-end">
          <Badge className="badge badge-primary">{videoData.host_id.name}</Badge>
        </div>

      </CardContent>
    </Card>
  );
};
