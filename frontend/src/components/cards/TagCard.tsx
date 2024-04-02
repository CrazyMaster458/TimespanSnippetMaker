import { Tag } from "@/lib/types";
import { OptionDialog } from "../OptionDialog";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";

export const TagCard = ({ tagData }: { tagData: Tag }) => {
  return (
    <>
      <Link to={`/snippets?t=${tagData.id}`} className="no-underline">
        <Card className="flex cursor-pointer flex-row drop-shadow-md">
          <OptionDialog endpoint="tag" itemData={tagData} />

          <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
            {tagData.name}
          </CardContent>
        </Card>
      </Link>
    </>
  );
};
