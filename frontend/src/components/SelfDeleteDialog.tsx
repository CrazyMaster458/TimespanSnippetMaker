import React from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { DeleteDialog } from "./DeleteDialog";
import { Button } from "./ui/button";

export const SelfDeleteDialog = ({
  endpoint,
  itemData,
}: {
  endpoint: string;
  itemData: any;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="destructive">Delete account</Button>
        </DialogTrigger>
        <DeleteDialog
          itemId={itemData.id}
          setOpen={setOpen}
          endpoint={endpoint}
          loginRedirect={true}
        />
      </Dialog>
    </>
  );
};
