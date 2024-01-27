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
import { Navigate, useNavigate } from "react-router-dom"

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

  const [uploadProgress, setUploadProgress] = useState("");
  const [videoId, setVideoId] = useState();


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

  useEffect(() => {
    if (uploadProgress){
      console.log(uploadProgress);
    }
  }, [uploadProgress]);

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

  useEffect(() => {
    if (videoId){
      console.log(videoId);
    }
  }, [videoId]);
    
  const handleVideoChange = async (e: any) => {
    setFilePath(e.target.files[0]);
  
    try {
      let videoId = await createVideo();
      await uploadVideo(e.target.files[0], videoId);
    } catch (error) {
      console.error("Error handling video change:", error);
    }
};


  const handleThumbnailChange = async (e: any) => {
    setThumbnailPath(e.target.files[0]);
    try {
      await uploadImage(e.target.files[0]);
    } catch (error) {
      console.error("Error handling video change:", error);
    }
  }

  const updateVideo = () => {
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .put(`/video/${videoId}`, {
        title: title,
        host_id: host,
        guests: guests,
        video_type_id: videoType,
      })
      .then(({ data }) => {
        console.log(data);
        navigate("/listview");
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

  const uploadVideo = async (file : any, videoId: number) => {
    setError({ __html: "" });
    type ErrorArray = string[];
  
    try {
      const formData = new FormData();
      formData.append('video', file);
      const response = await axiosClient.post(`/upload-video/${videoId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(`${percentCompleted}%`);
            console.log(`Upload Progress: ${percentCompleted}%`);
        },
    });
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        const finalErrors = (
          Object.values(error.response.data.errors) as ErrorArray
        ).reduce<string[]>((accum, next) => [...accum, ...next], []);
        setError({ __html: finalErrors.join("<br />") });
      }
      console.error(error);
    }
  };


  const uploadImage = async (file : any) => {
    setError({ __html: "" });
    type ErrorArray = string[];
  
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await axiosClient.post(`/upload-image/${videoId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        const finalErrors = (
          Object.values(error.response.data.errors) as ErrorArray
        ).reduce<string[]>((accum, next) => [...accum, ...next], []);
        setError({ __html: finalErrors.join("<br />") });
      }
      console.error(error);
    }
  };

  const createVideo = async () => {
    setError({ __html: "" });
    type ErrorArray = string[];

    try {
      // Start the asynchronous operation
      const response = await axiosClient.post("/video");
      setVideoId(response.data.data.id);
      return response.data.data.id;
    } catch (error) {
      if (error.response) {
        const finalErrors = (
          Object.values(error.response.data.errors) as ErrorArray
        ).reduce<string[]>((accum, next) => [...accum, ...next], []);
        setError({ __html: finalErrors.join("<br />") });
      }
      console.error(error);
    }
  };

  const navigate = useNavigate();

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
        {uploadProgress} 
        {step !== 4 ? <Button onClick={handleNext}>Next</Button> : <Button onClick={updateVideo}>Create</Button>}
        </CardFooter>
    </Card>
    </div>
  )
}
