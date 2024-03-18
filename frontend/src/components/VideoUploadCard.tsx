/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import * as api from "./api";
import { Select } from "./Select";

const steps = [
  {
    title: "Upload Video",
    description: "Upload a viddeo file and fill in details.",
  },
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

export function CardWithForm() {
  const [title, setTitle] = useState("");
  const [host, setHost] = useState<number | null>(null);
  const [videoType, setVideoType] = useState<number | null>(null);
  const [guests, setGuests] = useState<number[]>([]);
  const [error, setError] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [videoId, setVideoId] = useState<number | null>(null);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [videoTypes, setVideoTypes] = useState<any[]>([]);
  const [stepNum, setStepNum] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .fetchVideoParameters()
      .then((res) => {
        setInfluencers(res.influencers || []);
        setVideoTypes(res.videoTypes || []);
      })
      .catch((error) => {
        console.error("Error fetching video parameters:", error);
      });
  }, []);

  const handleNext = () => {
    if (stepNum + 1 < 5) {
      setStepNum(stepNum + 1);
    }
  };

  const handleBack = () => {
    if (stepNum - 1 > 0) {
      setStepNum(stepNum - 1);
    }
  };

  const handleVideoChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      // setFilePath(e.target.files[0]);

      try {
        const id = await api.createVideo();
        setVideoId(id);

        await api.uploadFile(
          `/upload-video/${id}`,
          e.target.files[0],
          "video",
          (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(`${percentCompleted}%`);
            // console.log(`Upload Progress: ${percentCompleted}%`);
          },
        );
      } catch (error) {
        console.error("Error handling video change:", error);
      }
    }
  };

  const handleThumbnailChange = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      // setThumbnailPath(e.target.files[0]);

      try {
        await api.uploadFile(
          `/upload-image/${videoId}`,
          e.target.files[0],
          "image",
        );
      } catch (error) {
        console.error("Error handling video change:", error);
      }
    }
  };

  const updateVideo = async () => {
    setError([]);

    try {
      await api.updateVideo(videoId!, {
        title: title,
        host_id: host,
        guests,
        video_type_id: videoType,
      });
      navigate("/listview");
    } catch (error) {
      if (error.response) {
        setError(Object.values(error.response.data.errors).flat());
      }
      console.error("Error updating video:", error);
    }
  };

  const handleHostSelect = (value: any) => {
    setHost(typeof value[0] === "number" ? value[0] : null);
  };

  const handleGuestsSelect = (value: any) => {
    setGuests(Array.isArray(value) ? value : []);
  };

  const handleVideoSelect = (value: any) => {
    setVideoType(value.length > 0 ? value[0] : null);
  };

  return (
    <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
      <Card className="flex h-[78vh] w-[60vw] flex-col">
        <CardHeader className="px-12">
          <ul className="steps pb-4 pt-4">
            {steps.map((step, index) => (
              <li
                key={index}
                className={`step ${stepNum > index ? "step-primary" : ""}`}
              >
                {step.title}
              </li>
            ))}
          </ul>
          <CardTitle>{steps[stepNum - 1].title}</CardTitle>
          <CardDescription>{steps[stepNum - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="grow px-12">
          <form className="grid">
            {stepNum === 1 && (
              <div className="upload">
                <div className="col-span-4 grid w-full gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="video">Upload Video</Label>
                    <Input
                      id="video"
                      type="file"
                      name="file_path"
                      placeholder="Video File"
                      required
                      accept=".mp4,.mov,.mkv,.avi"
                      onChange={handleVideoChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {stepNum === 2 && (
              <div className="details grid grid-cols-7 gap-8">
                <div className="col-span-4">
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

                  <Label htmlFor="video_type">Video Type</Label>
                  {/* <SingleSelect
                    data={videoTypes}
                    endpoint="video_type"
                    value={videoType}
                    setValue={setVideoType}
                    setData={setVideoTypes}
                  /> */}
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
              </div>
            )}

            {stepNum === 3 && (
              <div className="guests">
                <Label htmlFor="host">Host</Label>
                {/* <SingleSelect
                  data={influencers}
                  endpoint="influencer"
                  value={host}
                  setValue={setHost}
                  setData={setInfluencers}
                /> */}

                <Label htmlFor="guests">Guests</Label>
                {/* <SelectComponent data={influencers} onSelect={handleGuestsSelect} multi={true} endpoint="influencer"/> */}
                {/* <MultiSelect
                  data={influencers}
                  endpoint="influencer"
                  value={guests}
                  setValue={setGuests}
                  setData={setInfluencers}
                /> */}
              </div>
            )}

            {stepNum === 4 && (
              <>
                {error.length > 0 && (
                  <div className="mb-2 rounded bg-red-500 p-2 px-3 text-sm text-white">
                    {error.map((errMsg, index) => (
                      <div key={index}>{errMsg}</div>
                    ))}
                  </div>
                )}
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {stepNum !== 1 ? (
            <Button onClick={handleBack} variant="outline">
              Back
            </Button>
          ) : (
            <p></p>
          )}
          {uploadProgress}
          {stepNum !== 4 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={updateVideo}>Create</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
