import { Card, CardContent } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const VideoCard = () => {
  const navigate = useNavigate();

  const HandleCardClick = () => {
    navigate("/detail");
  };

  return (
    <Card
      className="overflow-hidden w-full h-full hover:bg-slate-100 hover:scale-105 cursor-pointer transition duration-150 ease-in-out drop-shadow-md active:scale-95"
      onClick={HandleCardClick}
    >
      <img src="image2.jpg" alt="" className="aspect-video w-full" />
      <CardContent className="pt-2">
        <p className="font-medium">
          Dillon Danis DESTROYS Logan Paul In Face To Face
        </p>
        <Badge className="mt-2" variant="progress">
          In Progress
        </Badge>
      </CardContent>
    </Card>
  );
};
