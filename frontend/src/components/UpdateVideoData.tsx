import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getData, putData, uploadFile, validateNulls } from "@/services/api";
import { useState } from "react";
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

const steps = [
  {
    title: "Details",
    description: "Upload a viddeo file and fill in details.",
  },
  {
    title: "Host & Guests",
    description: "Upload a viddeo file and fill in details.",
  },
  {
    title: "Visibility",
    description: "Upload a viddeo file and fill in details.",
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
  const [selectedHost, setSelectedHost] = useState<Option[] | []>(
    videoData
      ? ([
          { value: videoData.host_id?.id, label: videoData.host_id?.name },
        ] as Option[])
      : [],
  );
  const [selectedVideoTypes, setSelectedVideoTypes] = useState<Option[]>(
    videoData
      ? ([
          {
            value: videoData.video_type_id?.id,
            label: videoData.video_type_id?.name,
          },
        ] as Option[])
      : [],
  );

  const mappedGuests = videoData?.guests
    ? videoData.guests.map((guest) => guest.id)
    : [];
  const [selectedGuests, setSelectedGuests] = useState<Option[]>(
    influencersData
      ? influencersData
          .filter((influencer) => mappedGuests.includes(influencer.id))
          .map(
            (influencer) =>
              ({ value: influencer.id, label: influencer.name }) as Option,
          )
      : [],
  );

  const [stepNum, setStepNum] = useState(1);

  const { mutateAsync: uploadImageFile } = useMutation({
    mutationFn: ({ file, id }: { file: File; id: number }) =>
      uploadFile(`/upload-image/${id}`, file, "image"),
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
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

  const handleThumbnailChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadImageFile({ file: e.target.files[0], id: videoData.id });
    }
  };

  const { mutateAsync: updateVideoData } = useMutation({
    mutationFn: (data: UpdateVideo) =>
      putData(`/videos/${data.id}`, data, updateVideoSchema),
    onSuccess: (data) => {
      setOpen(false);
      const queryKey = ["videos", data.id];

      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Error updating snippet:", error);
    },
  });

  const updateVideo = async () => {
    const areErrors = validateNulls([selectedHost, selectedVideoTypes]);

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
      video_type_id: selectedVideoTypes[0].value,
    };

    await updateVideoData(data);
  };

  return (
    <>
      <DialogContent className="h-[85vh] min-w-[60vw]">
        <DialogHeader className="mb-0 h-[auto] pb-0">
          <DialogTitle>{steps[stepNum - 1].title}</DialogTitle>
          <DialogDescription>
            {steps[stepNum - 1].description}
          </DialogDescription>

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
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="video_type">Video Type</Label>
                  <CreateSelect
                    data={videoTypesData || []}
                    endpoint="video_types"
                    selectedOptions={selectedVideoTypes}
                    setSelectedOptions={setSelectedVideoTypes}
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
              <p>Not implemented</p>
            </>
          )}
        </form>
        <DialogFooter>
          {stepNum !== 1 ? (
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
          ) : (
            <p></p>
          )}
          {uploadProgress}
          {stepNum !== 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={updateVideo}>Create</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};
