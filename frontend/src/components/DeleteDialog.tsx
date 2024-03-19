import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteData } from "@/api";
import { LoadingButton } from "./LoadingButton";

export const DeleteDialog = ({
  videoId,
  queryClient,
  setOpen,
}: {
  videoId: number;
  queryClient: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutateAsync: deleteItem, isPending } = useMutation({
    mutationFn: () => deleteData(`/videos/${videoId}`),
    onSuccess: () => {
      console.log("Video deleted");
      queryClient.invalidateQueries("videos");
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleDelete = async () => {
    await deleteItem();
  };

  return (
    <>
      <DialogContent className="h-[24vh] min-w-[36vw]">
        <DialogHeader className="flex flex-row gap-5">
          <AlertTriangle color="red" height={50} size={75} />
          <section>
            <DialogTitle className="">Delete Video</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this video? All snippets from this
              video will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </section>
        </DialogHeader>
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
              <Button onClick={handleDelete} variant={"destructive"}>
                Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};
