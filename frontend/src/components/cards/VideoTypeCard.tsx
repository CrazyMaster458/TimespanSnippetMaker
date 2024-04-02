import { VideoType } from "@/lib/types";
import { OptionDialog } from "../OptionDialog";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

export const VideoTypeCard = ({
  videoTypeData,
}: {
  videoTypeData: VideoType;
}) => {
  return (
    <>
      <Link to={`/videos?vt=${videoTypeData.id}`} className="no-underline">
        <Card className="flex cursor-pointer flex-row drop-shadow-md">
          <OptionDialog endpoint="video_type" itemData={videoTypeData} />

          <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
            {videoTypeData.name}
          </CardContent>
        </Card>
      </Link>
    </>
  );
};
