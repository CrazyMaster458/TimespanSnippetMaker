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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerDemo } from "./DatePicker"
import { ComboboxDemo } from "./Combobox"
import axiosClient from "@/axios"
import { useEffect, useState } from "react"

export function CardWithForm() {
  const [title, setTitle] = useState("");
  const [dateUploaded, setDateUploaded] = useState("");
  const [filePath, setFilePath] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [host, setHost] = useState("1");
  const [videoType, setVideoType] = useState("1");
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
        console.log(res.data.influencers);
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

  return (
    <div className="absolute inset-0 flex justify-center h-full w-full items-center">
        <Card className="w-[60vw] h-[78vh] grid grid-col">
        <CardHeader>
        <ul className="steps pb-4 pt-4">
          <li className={`step ${step > 0 ? 'step-primary' : ''}`}>{steps[0].title}</li>
          <li className={`step ${step > 1 ? 'step-primary' : ''}`}>{steps[1].title}</li>
          <li className={`step ${step > 2 ? 'step-primary' : ''}`}>{steps[2].title}</li>
          <li className={`step ${step > 3 ? 'step-primary' : ''}`}>{steps[3].title}</li>
        </ul>
          <CardTitle>{steps[step-1].title}</CardTitle>
          <CardDescription>{steps[step-1].description}</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="grid">
              {step === 1 ? <>


                <div className="upload border-dashed border-2">
                <div className="col-span-4 grid w-full gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="video">Upload Video</Label>
                      <Input id="video" type="file" />
                    </div>
                </div>
              </div>

              </> : null}
              
              {step === 2 ? <>
                <div className="details">
                <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Title of your project"
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                  />

                  <Label htmlFor="date">Upload Date</Label>
                  <DatePickerDemo></DatePickerDemo>

                  <Label htmlFor="thumbnail">Upload Thumbnail</Label>
                      <Input id="thumbnail" type="file" />

                  <ComboboxDemo/>

                  <Label htmlFor="video_type">Video Type</Label>
                  <Select>
                      <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              </> : null}

              {step === 3 ? <>
                <div className="guests">
                <Label htmlFor="host">Host</Label>
                  <Select>
                      <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                  </Select>

                  <Label htmlFor="guests">Guests</Label>
                  <Select>
                      <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="sveltekit">SvelteKit</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                      <SelectItem value="nuxt">Nuxt.js</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              </> : null}

              {step === 4 ? <>
              
              </> : null}


            </form>
        </CardContent>
        <CardFooter className="self-end flex justify-between">
            <Button onClick={handleBack} variant="outline">Back</Button>
            <Button onClick={handleNext}>Next</Button>
        </CardFooter>
    </Card>
    </div>
  )
}
