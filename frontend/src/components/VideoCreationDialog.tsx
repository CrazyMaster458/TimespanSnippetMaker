import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus, Plus } from "lucide-react";
import { createNewVideo, uploadFile } from "@/services/api";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadVideo } from "./UploadVideo";
import { UpdateaVideoData } from "./UpdateVideoData";
import { AxiosProgressEvent } from "axios";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Button } from "./ui/button";

const MAX_UPLOAD_SIZE_MB = 2;

export const VideoCreationDialog = ({
  emptyStateButton = false,
}: {
  emptyStateButton?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [isTriggered, setIsTriggered] = useState(false);

  const {
    mutateAsync: createNewVideo2,
    isPending,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: createNewVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setIsTriggered(false);
    },
    onError: () => {
      toast.error("Something went wrong, please try again later");
    },
  });

  const { mutateAsync: uploadVideoFile, isPending: isUploadPending } =
    useMutation({
      mutationFn: ({ file, id }: { file: File; id: number }) =>
        uploadFile(`/upload-video/${id}`, file, "video", onUploadProgress),
      onSuccess: () => {
        toast.success("Video successfully uploaded");
      },
      onError: () => {
        toast.error("Something went wrong during the uploading process");
      },
    });

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total !== null && progressEvent.total !== undefined) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      setUploadProgress(`${percentCompleted}%`);
    }
  };

  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleVideoChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const totalSize: number = Array.from<File>(e.target.files).reduce(
        (acc: number, file: File) => acc + file.size,
        0,
      );
      const totalSizeMB = totalSize / (1024 * 1024);

      if (totalSizeMB > MAX_UPLOAD_SIZE_MB) {
        toast.error(
          `Total upload size exceeds the limit of ${MAX_UPLOAD_SIZE_MB} MB`,
        );
        return;
      }

      const data = await createNewVideo2("/videos");
      await uploadVideoFile({ file: e.target.files[0], id: data.id });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger onClick={() => setIsTriggered(true)}>
                {emptyStateButton ? (
                  <Button>
                    <Plus className="m-0 h-7 w-7 p-0 pr-2" />
                    {`Create New Video`}
                  </Button>
                ) : (
                  <button className="btn btn-circle btn-ghost">
                    <FolderPlus />
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Create video</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        {!isTriggered && isSuccess && !isPending && data ? (
          <>
            <UpdateaVideoData
              uploadProgress={uploadProgress}
              videoData={data}
              queryClient={queryClient}
              setOpen={setOpen}
            />
          </>
        ) : (
          <>
            <UploadVideo
              handleVideoChange={handleVideoChange}
              isPending={isPending}
              isUploadPending={isUploadPending}
            />
          </>
        )}
      </Dialog>
    </>
  );
};
