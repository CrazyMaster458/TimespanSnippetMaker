import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosClient from "@/axios"
import { useEffect, useState } from "react"
import { SelectComponent }from "./MultiSelect"

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
]

export function CardWithForm() {
  const [title, setTitle] = useState("");
  const [filePath, setFilePath] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [host, setHost] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const [guests, setGuests] = useState<string[]>([]);
  const [error, setError] = useState({ __html: "" });

  const [loading, setLoading] = useState(true);
  const [influencers, setInfluencers] = useState([]);
  const [videoTypes, setVideoTypes] = useState([]);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/video_parameters`)
      .then((res) => {
        setLoading(false);
        console.log(res.data.videoTypes);
        setInfluencers(res.data.influencers);
        setVideoTypes(res.data.videoTypes)
      })
      .catch((error) => {
        setLoading(false);
        console.log("error");
      });
  }, []);

  const [step, setStep] = useState(1);

  const handleNext = () => {
    if(step + 1 < 5){
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if(step - 1 > 0){
      setStep(step - 1);
    }
  };
    
  const handleVideoChange = (e: any) => {
    setFilePath(e.target.files[0]);
  }
  const handleThumbnailChange = (e: any) => {
    setThumbnailPath(e.target.files[0]);
  }

  const createVideo = () => {
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/video", {
        title: title,
        video: filePath,
        image: thumbnailPath,
        host_id: host,
        guests: guests,
        video_type_id: videoType,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = (
            Object.values(error.response.data.errors) as ErrorArray
          ).reduce<string[]>((accum, next) => [...accum, ...next], []);
          setError({ __html: finalErrors.join("<br />") });
        }
        console.log(error);
      });
  };

  return (
    <div className="overflow-hidden absolute inset-0 flex justify-center h-full w-full items-center">
        <Card className="w-[60vw] h-[78vh] flex flex-col">
        <CardHeader className="px-12">
        <ul className="steps pb-4 pt-4">
          <li className={`step ${step > 0 ? 'step-primary' : ''}`}>{steps[0].title}</li>
          <li className={`step ${step > 1 ? 'step-primary' : ''}`}>{steps[1].title}</li>
          <li className={`step ${step > 2 ? 'step-primary' : ''}`}>{steps[2].title}</li>
          <li className={`step ${step > 3 ? 'step-primary' : ''}`}>{steps[3].title}</li>
        </ul>
          <CardTitle>{steps[step-1].title}</CardTitle>
          <CardDescription>{steps[step-1].description}</CardDescription>
        </CardHeader>
        <CardContent className="grow px-12">
            <form className="grid">
              {step === 1 ? <>
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

              </> : null}
              
              {step === 2 ? <>
                <div className="details grid grid-cols-7 gap-8">
                  <div className="col-span-4">
                    <div className="border-2 rounded pt-2 px-3 pb-4">
                      <Label htmlFor="title" className="text-gray-500	text-xs font-medium">Title (required)</Label>
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
                    <SelectComponent data={videoTypes} onSelect={(value) => setVideoType(value[0])}/>
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
              </> : null}

              {step === 3 ? <>
                <div className="guests">
                <Label htmlFor="host">Host</Label>
                <SelectComponent data={influencers} onSelect={(value) => setHost(value[0])}/>


                <Label htmlFor="guests">Guests</Label> 
                <SelectComponent data={influencers} onSelect={(value) => setGuests(value)} multi={true}/>

              </div>
              </> : null}

              {step === 4 ? <>
                {error.__html && (
                    <div
                    className="bg-red-500 text-sm rounded mb-2 p-2 px-3 text-white"
                    dangerouslySetInnerHTML={error}
                ></div>)}
              </> : null}
            </form>
        </CardContent>
        <CardFooter className="flex justify-between">
        {step !== 1 ? <Button onClick={handleBack} variant="outline">Back</Button> : <p></p>}
        {step !== 4 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={createVideo}>Create</Button>}
        </CardFooter>
    </Card>
    </div>
  )
}
