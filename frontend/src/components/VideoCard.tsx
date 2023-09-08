import { Card, CardContent } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";

export const VideoCard = () => {
  const navigate = useNavigate();

  const HandleCardClick = () => {
    navigate("/detail");
  };

  return (
    <Card
      className="overflow-hidden h-64 hover:bg-slate-100 hover:scale-105 cursor-pointer transition duration-150 ease-in-out drop-shadow-md active:scale-95"
      onClick={HandleCardClick}
    >
      <img src="image2.jpg" alt="" className="overflow-hidden" />
      <CardContent className="pt-2">
        <p className="font-medium">Ask me anything</p>
      </CardContent>
    </Card>
  );
};
