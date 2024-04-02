import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";
import { LoadingButton } from "./LoadingButton";
import { useDeleteItemMutation } from "@/services/mutations";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteDialog = ({
  itemId,
  setOpen,
  endpoint,
  loginRedirect = false,
}: {
  itemId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  endpoint: string;
  loginRedirect?: boolean;
}) => {
  const { mutateAsync: deleteItem, isPending } = useDeleteItemMutation(
    `${endpoint}s`,
  );
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    await deleteItem(itemId);
    setOpen(false);
    if (loginRedirect) {
      queryClient.removeQueries();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <>
      <DialogContent className="min-w-[36vw]">
        <DialogHeader className="flex flex-row gap-5">
          <AlertTriangle color="red" height={50} size={75} />
          <section>
            <DialogTitle className="pb-2">Delete {endpoint}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {endpoint}? <br />
              This action cannot be undone.
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
