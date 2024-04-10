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
  BasicProp,
  influencerSchema,
  tagSchema,
  videoTypeSchema,
} from "@/lib/types";
import { Schema } from "zod";
import { toast } from "sonner";

export const UpdateItemData = ({
  itemData,
  queryClient,
  setOpen,
  endpoint,
}: {
  itemData: BasicProp;
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
    onSuccess: (data) => {
      if (data.errors) {
        return;
      }
      queryClient.invalidateQueries([`${endpoint}s`]);
      setOpen(false);
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong, please try again later");
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
          maxLength={25}
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
