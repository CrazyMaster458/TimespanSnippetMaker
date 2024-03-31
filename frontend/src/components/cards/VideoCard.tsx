import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { LoggedUser, Video } from "@/lib/types";
import { UpdateDialog } from "../UploadFileDialog copy";

export const VideoCard = ({
  videoData,
  user,
  publicView = false,
}: {
  videoData: Video;
  user: LoggedUser | null;
  publicView?: boolean;
}) => {
  // const isEditable =
  //   user?.admin === 1
  //     ? true
  //     : videoData.published
  //       ? false
  //       : videoData.user_id === user?.id;

  const isEditable =
    user?.admin === 1
      ? true
      : publicView
        ? false
        : videoData.user_id === user?.id;

  return (
    <>
      <Link to={`/detail/${videoData.id}`} className="no-underline">
        <Card className="flex h-full w-full cursor-pointer flex-col overflow-hidden pb-4 drop-shadow-md">
          {isEditable ? (
            <UpdateDialog endpoint="video" itemData={videoData} />
          ) : null}

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
              {/* {videoData.video_type_id.name || ""} */}
            </Badge>
          </CardFooter>
        </Card>
      </Link>
    </>
  );
};
