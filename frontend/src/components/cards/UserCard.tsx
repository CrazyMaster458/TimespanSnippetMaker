import { User } from "@/lib/types";
import { OptionDialog } from "../OptionDialog";
import { Card, CardContent } from "../ui/card";
import { User as UserIcon } from "lucide-react";

export const UserCard = ({ userData }: { userData: User }) => {
  return (
    <>
      <Card className="flex cursor-pointer flex-row drop-shadow-md">
        <OptionDialog endpoint="user" itemData={userData} canUpdate={false} />

        <CardContent className="flex flex-row gap-2 px-4 py-2 text-base font-semibold">
          <UserIcon size={20} />
          {userData.username}
        </CardContent>
      </Card>
    </>
  );
};
