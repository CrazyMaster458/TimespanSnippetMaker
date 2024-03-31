import { VideoType } from "@/lib/types";
import { UpdateDialog } from "../UploadFileDialog copy";
import { Card, CardContent } from "../ui/card";

export const VideoTypeCard = ({
  videoTypeData,
}: {
  videoTypeData: VideoType;
}) => {
  return (
    <>
      <Card className="flex cursor-pointer flex-row drop-shadow-md">
        <UpdateDialog endpoint="video_type" itemData={videoTypeData} />

        <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
          {videoTypeData.name}
        </CardContent>
      </Card>
    </>
  );
};
