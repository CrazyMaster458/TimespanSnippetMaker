/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function VideoForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [title, setTitle] = useState("");
  const [dateUploaded, setDateUploaded] = useState("");
  const [filePath, setFilePath] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [host, setHost] = useState("1");
  const [videoType, setVideoType] = useState("1");
  const [guests, setGuests] = useState<string[]>([]);
  const [error, setError] = useState({ __html: "" });

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [influencers, setInfluencers] = useState([]);


  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/video_type`)
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
        return axiosClient.get('/influencer');
      })
      .then((res2) => {
        setLoading(false);
        setInfluencers(res2.data.data);
        return res2;
      })
      .catch((error) => {
        setLoading(false);
        console.log("error");
        return error;
      });
  }, []);
  
  
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/video", {
        title: title,
        date_uploaded: dateUploaded,
        file_path: filePath,
        thumbnail_path: thumbnailPath,
        host_id: host,
        guests: guests,
        video_type_id: videoType,
      })
      .then(({ data }) => {
        console.log(data);
        // console.log(guests); 
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
      <h1>Signup</h1>

      {loading && <div className="flex justify-center">Loading...</div>}

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
              value={filePath}
              accept=".mp4,.mov,.mkv,.avi"
              onChange={(e) => setFilePath(e.target.value)}
            />
            <input
              type="file"
              name="thumbnail_path"
              placeholder="Video File"
              required
              value={thumbnailPath}
              accept=".jpeg,.png,.webp,"
              onChange={(e) => setThumbnailPath(e.target.value)}
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

            {data && (
              <>
                <select
                  name="video_type"
                  id="video_type"
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value)}
                >
                  {data.map((item : any) => (
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
