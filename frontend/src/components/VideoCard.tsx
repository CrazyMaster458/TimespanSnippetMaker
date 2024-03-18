import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Video } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const VideoCard = ({ videoData }: { videoData: Video }) => {
  return (
    <>
      <Link to={`/detail/${videoData.id}`} className="no-underline">
        <Card className="video-card flex h-full w-full cursor-pointer flex-col overflow-hidden pb-4 drop-shadow-md">
          <img
            src={videoData.image_url || ""}
            alt=""
            className="aspect-video w-full"
          />
          <CardContent className="grow grid-cols-1 pb-3 pt-2">
            <p className="font-medium">{videoData.title}</p>
          </CardContent>
          <CardFooter className="flex justify-between py-0">
            <p></p>
            <Badge className="badge badge-primary">
              ""
              {/* {videoData.video_type.name || ""} */}
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
};
