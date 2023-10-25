import { useState } from "react";
import axiosClient from "../../axios.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function VideoForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [title, setTitle] = useState("");
  const [dateUploaded, setDateUploaded] = useState("");
  const [filePath, setFilePath] = useState("");
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [host, setHost] = useState("");
  const [videoType, setVideoType] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [error, setError] = useState({ __html: "" });
  const [userId, setUserId] = useState(null);

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/video", {
        id: 2,
        user_id: userId,
        title: title,
        date_uploaded: dateUploaded,
        // file_path: filePath,
        // thumbnail_path: thumbnailPath,
        host_id: 1 /*host*/,
        // guests: guests,
        video_type_id: 1 /*videoType*/,
        video_code: 123457,
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

  axiosClient.get("/me").then(({ data }) => setUserId(data.id));
  // axiosClient.get("/user").then(({ data }) => console.log(data));

  return (
    <>
      <h1>Signup</h1>

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
          onChange={(e) => setFilePath(e.target.value)}
        />
        <input
          type="file"
          name="thumbnail_path"
          placeholder="Video File"
          required
          value={thumbnailPath}
          onChange={(e) => setThumbnailPath(e.target.value)}
        />
        {/* <select
          name="host"
          id="host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        >
          <option value="big">Strike it BIG</option>
          <option value="james">James</option>
          <option value="justin">Justin</option>
          <option value="rory">Rory</option>
        </select>

        <select
          name="video_type"
          id="video_type"
          value={videoType}
          onChange={(e) => setVideoType(e.target.value)}
        >
          <option value="big">Strike it BIG</option>
          <option value="james">James</option>
          <option value="justin">Justin</option>
          <option value="rory">Rory</option>
        </select>

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
          <option value="big">Strike it BIG</option>
          <option value="james">James</option>
          <option value="justin">Justin</option>
          <option value="rory">Rory</option>
        </select> */}

        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
