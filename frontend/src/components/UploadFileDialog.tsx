import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { createNewVideo, handleSuccess, uploadFile } from "@/api";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadVideo } from "./UploadVideo";
import { UpdateaVideoData } from "./UpdateVideoData";
import { AxiosProgressEvent } from "axios";
import React from "react";
import { Button } from "./ui/button";

export const UploadFileDialog = () => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const {
    mutateAsync: createNewVideo2,
    isPending,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: createNewVideo,
    onSuccess: (newItem) => {
      const queryName = ["videos"];
      queryClient.setQueryData(["videos", newItem.id], newItem);
      handleSuccess({ queryClient, queryName, newItem });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: uploadVideoFile } = useMutation({
    mutationFn: ({ file, id }: { file: File; id: number }) =>
      uploadFile(`/upload-video/${id}`, file, "video", onUploadProgress),
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    if (progressEvent.total !== null && progressEvent.total !== undefined) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      setUploadProgress(`${percentCompleted}%`);
      console.log(`Upload Progress: ${percentCompleted}%`);
    }
  };

  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleVideoChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        const data = await createNewVideo2("/videos");

        await uploadVideoFile({ file: e.target.files[0], id: data.id });
      } catch (error) {
        console.error("Error handling video change:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <button className="btn btn-circle btn-ghost">
            <FolderPlus className="h-5 w-5" />
          </button>
        </DialogTrigger>
        {isSuccess && !isPending ? (
          <>
            <UpdateaVideoData
              uploadProgress={uploadProgress}
              videoId={data.id}
              queryClient={queryClient}
              setOpen={setOpen}
            />
          </>
        ) : (
          <>
            <UploadVideo
              handleVideoChange={handleVideoChange}
              isPending={isPending}
            />
          </>
        )}
      </Dialog>
    </>
  );
};