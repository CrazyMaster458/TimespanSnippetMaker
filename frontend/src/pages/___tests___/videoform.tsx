/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { DatePickerDemo } from "@/components/DatePicker.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function VideoForm() {
  //   const { userToken, currentUser } = useStateContext();
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
  
  const handleVideoChange = (e: any) => {
    setFilePath(e.target.files[0]);
  }
  const handleThumbnailChange = (e: any) => {
    setThumbnailPath(e.target.files[0]);
  }
  
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // const fData = new FormData();

    // fData.append('image', thumbnailPath);
    // fData.append('video', filePath);

    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/video", {
        title: title,
        date_uploaded: dateUploaded,
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
    <>
      <h1 className="pt-16">Signup</h1>

      {loading && <div className="flex justify-center">Loading...</div>}

      <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />

      <DatePickerDemo/>

      {!loading && (
        <>
          {error.__html && (
            <div
              className="bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error}
            ></div>
          )}

          <form onSubmit={onSubmit} className="pt-16">
            <input
              type="text"
              name="title"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="date"
              name="date_uploaded"
              placeholder="Date Uploaded"
              required
              value={dateUploaded}
              onChange={(e) => setDateUploaded(e.target.value)}
            />
            <input
              type="file"
              name="file_path"
              placeholder="Video File"
              required
              accept=".mp4,.mov,.mkv,.avi"
              onChange={handleVideoChange}
            />
            <input
              type="file"
              name="thumbnail_path"
              placeholder="Video File"
              required
              accept=".jpeg,.png,.webp,.jpg"
              onChange={handleThumbnailChange}
            />

            {influencers && (
              <>
                <select
                  name="guests"
                  id="guests"
                  value={guests}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setGuests(selectedOptions);
                  }}
                  multiple
                >
                  {influencers.map((item : any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}                
                </select> 
              </>
            )}

            {videoTypes && (
              <>
                <select
                  name="video_type"
                  id="video_type"
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                >
                  {videoTypes.map((item : any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}                
                </select> 
              </>
            )}

            {influencers && (
              <>
                <select
                  name="host"
                  id="host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                >
                  {influencers.map((item : any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}                
                </select> 
              </>
            )}

            <button type="submit">Sign up</button>
          </form>
        </>
      )}
    </>
  );
}
