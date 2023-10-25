import { useState } from "react";
import axiosClient from "../../axios.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function SnippetForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [hook, setHook] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("00:00:00");
  const [endsAt, setEndsAt] = useState("00:00:00");
  const [filePath, setFilePath] = useState("");
  const [videoType, setVideoType] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState({ __html: "" });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/snippet", {
        hook: hook,
        description: description,
        starts_at: "00:01:00",
        ends_at: "00:02:00",
        // file_path: filePath,
        video_type_id: 1,
        video_id: 2,
        snippet_code: 123456,
        // tags: tags,
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
      <h1>Signup</h1>

      {error.__html && (
        <div
          className="bg-red-500 rounded py-2 px-3 text-white"
          dangerouslySetInnerHTML={error}
        ></div>
      )}

      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="hook"
          placeholder="Hook"
          required
          value={hook}
          onChange={(e) => setHook(e.target.value)}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="time"
          name="starts_at"
          placeholder="Starts at"
          required
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
        <input
          type="time"
          name="ends_at"
          placeholder="Ends at"
          required
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
        />
        <input
          type="file"
          name="file_path"
          placeholder="Video File"
          required
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
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
          name="tags"
          id="tags"
          value={tags}
          onChange={(e) => {
            const selectedOptions = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setTags(selectedOptions);
          }}
          multiple
        >
          <option value="big">Strike it BIG</option>
          <option value="james">James</option>
          <option value="justin">Justin</option>
          <option value="rory">Rory</option>
        </select>

        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
