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
import { deleteData } from "@/services/api";
import { LoadingButton } from "./LoadingButton";

export const DeleteDialog = ({
  itemId,
  queryClient,
  setOpen,
  endpoint,
}: {
  itemId: number;
  queryClient: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  endpoint: string;
}) => {
  const { mutateAsync: deleteItem, isPending } = useMutation({
    mutationFn: () => deleteData(`/${endpoint}s/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries([`${endpoint}s`]);
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
      <DialogContent className="min-w-[36vw]">
        <DialogHeader className="flex flex-row gap-5">
          <AlertTriangle color="red" height={50} size={75} />
          <section>
            <DialogTitle className="pb-2">Delete {endpoint}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {endpoint}? This action
              cannot be undone.
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
