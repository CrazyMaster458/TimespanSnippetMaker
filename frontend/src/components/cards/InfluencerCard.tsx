import { Influencer } from "@/lib/types";
import { OptionDialog } from "../OptionDialog";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

export const InfluencerCard = ({
  influencerData,
}: {
  influencerData: Influencer;
}) => {
  return (
    <>
      <Link to={`/videos?h=${influencerData.id}`} className="no-underline">
        <Card className="flex cursor-pointer flex-row drop-shadow-md">
          <OptionDialog endpoint="influencer" itemData={influencerData} />

          <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
            {influencerData.name}
          </CardContent>
        </Card>
      </Link>
    </>
  );
};
