import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getData, putData, uploadFile, validateNulls } from "@/services/api";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CreateSelect } from "./CreateSelect";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Option,
  UpdateVideo,
  influencerSchema,
  videoTypeSchema,
  updateVideoSchema,
  Video,
  Influencer,
  VideoType,
} from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { LoadingButton } from "./LoadingButton";

const MAX_THUMBNAIL_SIZE_MB = 2;

const steps = [
  {
    title: "Details",
  },
  {
    title: "Host & Guests",
  },
  {
    title: "Visibility",
  },
];

export const UpdateaVideoData = ({
  uploadProgress,
  videoData,
  queryClient,
  setOpen,
}: {
  uploadProgress?: string;
  videoData: Video;
  queryClient: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: videoTypesData } = useQuery<VideoType[]>({
    queryKey: ["video_types"],
    queryFn: () => getData("/video_types"),
  });

  const { data: influencersData } = useQuery<Influencer[]>({
    queryKey: ["influencers"],
    queryFn: () => getData("/influencers"),
  });

  const [title, setTitle] = useState(videoData?.title || "");
  const [selectedHost, setSelectedHost] = useState<Option[]>(
    videoData && videoData.host_id
      ? [{ value: videoData.host_id.id, label: videoData.host_id.name }]
      : [],
  );

  const [selectedVideoType, setSelectedVideoType] = useState<Option[]>(
    videoData && videoData.video_type_id
      ? [
          {
            value: videoData.video_type_id.id,
            label: videoData.video_type_id.name,
          },
        ]
      : [],
  );

  const [selectedGuests, setSelectedGuests] = useState<Option[]>([]);

  useEffect(() => {
    if (videoData && videoData.guests && influencersData) {
      const mappedGuests = videoData.guests.map((guest) => guest.influencer_id);
      setSelectedGuests(
        influencersData
          .filter((influencer) => mappedGuests.includes(influencer.id))
          .map(
            (influencer) =>
              ({ value: influencer.id, label: influencer.name }) as Option,
          ),
      );
    } else {
      setSelectedGuests([]);
    }
  }, [videoData, influencersData]);

  const [stepNum, setStepNum] = useState(1);

  const { mutateAsync: uploadImageFile } = useMutation({
    mutationFn: ({ file, id }: { file: File; id: number }) =>
      uploadFile(`/upload-image/${id}`, file, "image"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
      toast.success("Image successfully uploaded");
    },
    onError: () => {
      toast.error(
        "Something went wrong during the image uploading process. Please try again later.",
      );
    },
  });

  const handleNext = () => {
    if (stepNum + 1 < 4) {
      setStepNum(stepNum + 1);
    }
  };

  const handleBack = () => {
    if (stepNum - 1 > 0) {
      setStepNum(stepNum - 1);
    }
  };

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    const acceptedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptedFormats.includes(file.type)) {
      toast.error("Only JPEG, PNG, and WebP formats are allowed");
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_THUMBNAIL_SIZE_MB) {
      toast.error(`File size exceeds the limit of ${MAX_THUMBNAIL_SIZE_MB} MB`);
      return;
    }

    const image = new Image();
    image.src = URL.createObjectURL(file);
    await new Promise((resolve) => {
      image.onload = () => {
        const aspectRatio = image.width / image.height;
        if (aspectRatio !== 16 / 9) {
          toast.error("Thumbnail must be in a 16:9 aspect ratio");
          resolve(false);
        } else {
          resolve(true);
          uploadImageFile({ file, id: videoData.id });
        }
      };
    });
  };

  const { mutateAsync: updateVideoData, isPending: isUpdatePending } =
    useMutation({
      mutationFn: (data: UpdateVideo) =>
        putData(`/videos/${data.id}`, data, updateVideoSchema),
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["videos"],
        });
        if (data.data.published && !variables.published) {
          toast.success("Video successfully published");

          queryClient.invalidateQueries({
            queryKey: ["public"],
          });
        }

        setOpen(false);
      },
      onError: (error: any) => {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
          return;
        }
        toast.error("Something went wrong, please try again later");
      },
    });

  const updateVideo = async () => {
    const areErrors = validateNulls(selectedHost, selectedVideoType);

    if (areErrors) {
      return;
    }

    const data: UpdateVideo = {
      id: videoData.id,
      title: title,
      host_id: selectedHost[0].value,
      guests:
        selectedGuests.length > 0
          ? selectedGuests.map((guest) => guest.value)
          : undefined,
      video_type_id: selectedVideoType[0].value,
      visibility: visibility,
      published: videoData.published,
    };

    await updateVideoData(data);
  };

  const [visibility, setVisibility] = useState("private");

  const handleVisibilityChange = () => {
    setVisibility((prev) => (prev === "private" ? "public" : "private"));
  };

  return (
    <>
      <DialogContent className="h-[85vh] min-w-[60vw]">
        <DialogHeader className="mb-0 h-[auto] pb-0">
          <DialogTitle>{steps[stepNum - 1].title}</DialogTitle>

          <ul className="steps pt-4">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`step ${stepNum > index ? "step-primary" : ""}`}
              >
                {step.title}
              </li>
            ))}
          </ul>
        </DialogHeader>
        <form className="grow px-8 pt-4">
          {stepNum === 1 && (
            <section className="grid grid-cols-7 gap-8">
              <div className="col-span-4 flex flex-col gap-2">
                <div className="rounded border-2 px-3 pb-4 pt-2">
                  <Label
                    htmlFor="title"
                    className="text-xs font-medium text-gray-500"
                  >
                    Title (required)
                  </Label>
                  <input
                    className="w-full"
                    id="title"
                    placeholder="Title of your project"
                    type="text"
                    required
                    value={title}
                    maxLength={120}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="video_type">Video Type</Label>
                  <CreateSelect
                    data={videoTypesData || []}
                    endpoint="video_types"
                    selectedOptions={selectedVideoType}
                    setSelectedOptions={setSelectedVideoType}
                    placeholder="Select Video Type"
                    schema={videoTypeSchema}
                  />
                </div>
              </div>
              <div className="col-span-3">
                <Label htmlFor="thumbnail">Upload Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  name="thumbnail_path"
                  placeholder="Video File"
                  required
                  accept=".jpeg,.png,.webp,.jpg"
                  onChange={handleThumbnailChange}
                />
              </div>
            </section>
          )}

          {stepNum === 2 && (
            <section className="grid grid-cols-2 justify-stretch gap-5">
              <div className="">
                <Label htmlFor="host">Host</Label>
                <CreateSelect
                  data={influencersData || []}
                  endpoint="influencers"
                  selectedOptions={selectedHost}
                  setSelectedOptions={setSelectedHost}
                  placeholder="Select Host"
                  schema={influencerSchema}
                />
              </div>

              <div className="">
                <Label htmlFor="guests">Guests</Label>
                <CreateSelect
                  data={influencersData || []}
                  endpoint="influencers"
                  isMulti={true}
                  selectedOptions={selectedGuests}
                  setSelectedOptions={setSelectedGuests}
                  placeholder="Select Host"
                  schema={influencerSchema}
                />
              </div>
            </section>
          )}

          {stepNum === 3 && (
            <>
              <div className="rounded border-2 px-3 pb-4 pt-2">
                <Label htmlFor="title">Visibility</Label>
                <RadioGroup
                  onValueChange={handleVisibilityChange}
                  defaultValue={visibility}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="r1" />
                    <Label htmlFor="r1">Private</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="r2" />
                    <Label htmlFor="r2">Public</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </form>
        <DialogFooter>
          <section className="flex w-full flex-row justify-between">
            <span className="content-center">{uploadProgress}</span>
            <span className="flex gap-3">
              {stepNum !== 1 ? (
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
              ) : (
                <p></p>
              )}
              {stepNum !== 3 ? (
                <Button onClick={handleNext} disabled={isUpdatePending}>
                  Next
                </Button>
              ) : isUpdatePending ? (
                <LoadingButton />
              ) : (
                <Button onClick={updateVideo}>Update</Button>
              )}
            </span>
          </section>
        </DialogFooter>
      </DialogContent>
    </>
  );
};
