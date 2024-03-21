import { Tag } from "@/lib/types";
import { UpdateDialong } from "./UploadFileDialog copy";
import { Card, CardContent } from "./ui/card";

export const TagCard = ({ tagData }: { tagData: Tag }) => {
  return (
    <>
      <Card className="flex cursor-pointer flex-row drop-shadow-md">
        <UpdateDialong endpoint="tag" itemData={tagData} />

        <CardContent className="flex flex-row px-4 py-2 text-base font-semibold">
          {tagData.name}
        </CardContent>
      </Card>
    </>
  );
};
