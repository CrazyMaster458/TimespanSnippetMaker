import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { LoadingButton } from "./LoadingButton";
import { putData } from "@/services/api";
import { useMutation } from "@tanstack/react-query";
import {
  BasicData,
  influencerSchema,
  tagSchema,
  videoTypeSchema,
} from "@/lib/types";
import { Schema } from "zod";

export const UpdateItemData = ({
  itemData,
  queryClient,
  setOpen,
  endpoint,
}: {
  itemData: BasicData;
  queryClient: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  endpoint: string;
}) => {
  const [name, setName] = useState(itemData.name);

  let schema: Schema;

  switch (endpoint) {
    case "tag":
      schema = tagSchema;
      break;
    case "video_type":
      schema = videoTypeSchema;
      break;
    case "influencer":
      schema = influencerSchema;
      break;
    default:
      break;
  }

  const { mutateAsync: updateItemData, isPending } = useMutation({
    mutationFn: (data: any) =>
      putData(`/${endpoint}s/${data.id}`, data, schema),
    onSuccess: () => {
      queryClient.invalidateQueries([`${endpoint}s`]);
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpload = async () => {
    await updateItemData({ id: itemData.id, name: name });
  };

  return (
    <>
      <DialogContent className="">
        <DialogHeader className="flex flex-row gap-5">
          <DialogTitle className="pb-2">Update {endpoint}</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {isPending ? (
            <>
              <LoadingButton />
            </>
          ) : (
            <>
              <Button onClick={handleUpload}>Update</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};
