/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function SnippetForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("00:00:00");
  const [endsAt, setEndsAt] = useState("00:00:00");
  const [filePath, setFilePath] = useState("");
  const [videoType, setVideoType] = useState("");
  const [snippetTags, setSnippetTags] = useState<string[]>([]);
  const [error, setError] = useState({ __html: "" });

  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);


  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/tag`)
      .then((res) => {
        setLoading(false);
        console.log(res.data.data);
        setTags(res.data.data);
        return res;
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
      .post("/snippet", {
        description: description,
        starts_at: "00:01:00",
        ends_at: "00:02:00",
        file_path: filePath,
        video_type_id: 1,
        video_id: 34,
        snippet_tags: snippetTags,
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

      {loading && <div className="flex justify-center">Loading...</div>}

      {!loading && (
        <>

          {error.__html && (
            <div
              className="bg-red-500 rounded py-2 px-3 text-white"
              dangerouslySetInnerHTML={error}
            ></div>
          )}

          <form onSubmit={onSubmit} className="pt-8">
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

            {tags && (
                  <>
                    <select
                      name="snippet_tags"
                      id="snippet_tags"
                      value={snippetTags}
                      onChange={(e) => {
                        const selectedOptions = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value
                        );
                        setSnippetTags(selectedOptions);
                      }}
                      multiple
                    >
                      {tags.map((item : any) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}                
                    </select> 
                  </>
                )
              }

            <button type="submit">Sign up</button>
          </form>
        </>
      )}
    </>
  );
}
