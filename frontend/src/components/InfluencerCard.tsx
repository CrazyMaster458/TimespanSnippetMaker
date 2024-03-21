import { Influencer } from "@/lib/types";
import { UpdateDialong } from "./UploadFileDialog copy";
import { Card, CardContent } from "./ui/card";

export const InfluencerCard = ({
  influencerData,
}: {
  influencerData: Influencer;
}) => {
  return (
    <>
      <Card className="flex cursor-pointer flex-row drop-shadow-md">
        <UpdateDialong endpoint="influencer" itemData={influencerData} />

        <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
          {influencerData.name}
        </CardContent>
      </Card>
    </>
  );
};
