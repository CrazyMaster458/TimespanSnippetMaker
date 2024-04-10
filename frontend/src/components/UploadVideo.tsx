import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ArrowUpFromLine } from "lucide-react";
import { LoadingButton } from "./LoadingButton";

export const UploadVideo = ({
  handleVideoChange,
  isPending,
  isUploadPending,
}: {
  handleVideoChange: (e: any) => void;
  isPending: boolean;
  isUploadPending: boolean;
}) => {
  return (
    <DialogContent className="h-[85vh] min-w-[60vw]">
      <DialogHeader>
        <DialogTitle>Upload video</DialogTitle>
      </DialogHeader>
      <form>
        <section className="col-span-4 flex h-[65vh] w-[full] items-center">
          <div className=" flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-5">
              <ArrowUpFromLine className="uploadArrow h-12" />
              <div className="flex flex-col items-center">
                <h3 className="text-base font-medium">
                  {isUploadPending
                    ? `Please wait`
                    : `Drag and drop doesn't work`}
                </h3>
                <p className="text-base font-normal text-[#7f858e]">
                  {isUploadPending
                    ? `Video is being uploaded`
                    : `Upload a video file by clicking the button`}
                </p>
              </div>

              <input
                type="file"
                id="uploadButton"
                className="uploadButton"
                name="file_path"
                required
                accept=".mp4,.mov,.mkv,.avi"
                onChange={handleVideoChange}
              />
              {isPending || isUploadPending ? (
                <>
                  <LoadingButton className="" />
                </>
              ) : (
                <>
                  <label
                    htmlFor="uploadButton"
                    className="uploadLabel inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Select new file
                  </label>
                </>
              )}
            </div>
          </div>
        </section>
      </form>
      <DialogFooter>
        <></>
      </DialogFooter>
    </DialogContent>
  );
};
