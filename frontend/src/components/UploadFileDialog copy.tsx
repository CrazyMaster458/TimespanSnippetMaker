import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CircleEllipsis } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateaVideoData } from "./UpdateVideoData";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "./DeleteDialog";
import { UpdateItemData } from "./UpdateItemData";

export const UpdateDialong = ({
  endpoint,
  itemData,
}: {
  endpoint: string;
  itemData: any;
}) => {
  const [open, setOpen] = React.useState(false);
  const [isDeleteing, setIsDeleting] = React.useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger className="fixed right-1.5 top-1.5">
            <CircleEllipsis className="h-7 w-7 rounded-lg border border-gray-400 bg-white p-[2px] hover:bg-gray-200" />
          </DropdownMenuTrigger>
          <DialogTrigger onClick={(e) => e.stopPropagation()}>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => setIsDeleting(false)}
              >
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleting(true)}
                className="bg-red-500 hover:cursor-pointer hover:text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DialogTrigger>
        </DropdownMenu>
        <div onClick={(e) => e.stopPropagation()}>
          {isDeleteing && itemData ? (
            <DeleteDialog
              itemId={itemData.id}
              queryClient={queryClient}
              setOpen={setOpen}
              endpoint={endpoint}
            />
          ) : itemData && endpoint === "video" ? (
            <UpdateaVideoData
              videoId={itemData.id}
              queryClient={queryClient}
              setOpen={setOpen}
            />
          ) : (
            <UpdateItemData
              itemData={itemData}
              queryClient={queryClient}
              setOpen={setOpen}
              endpoint={endpoint}
            />
          )}
        </div>
      </Dialog>
    </>
  );
};
