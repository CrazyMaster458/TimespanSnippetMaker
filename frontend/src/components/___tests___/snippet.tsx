import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";

export const Snippet = ({videoId, snippetData, snippetId}: {videoId: string, snippetData: object, snippetId: string}) => {
    const [snippet, setSnippet] = useState([]);
    const [description, setDescription] = useState("");
    const [startsAt, setStartsAt] = useState('');
    const [endsAt, setEndsAt] = useState("");
    
    useEffect(() => {
      if (snippetData) {
        setDescription(snippetData.description || "New Snippet // <-- to split the hook from description");
        setStartsAt(snippetData.starts_at || "00:00:00");
        setEndsAt(snippetData.ends_at || "00:00:00");
      }
    }, [snippetData]);

    const onSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
    
        axiosClient
          .put("/snippet/" + snippetId, {
            description: description,
            starts_at: startsAt,
            ends_at: endsAt,
            video_type_id: 1,
            video_id: videoId,
          })
          .then(({ data }) => {
            console.log(data);
            setSnippet(data.data);
          })
          .catch((error) => {
            console.log(error);
          });
    };

    function handleCut(){
      axiosClient
      .post(`/cut/` + snippetId)
      .then(({ data }) => {
        console.log(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    function handleDelete(){
      axiosClient
      .delete(`/snippet/` + snippetId)
      .then(({ data }) => {
        console.log(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    return (
        <>
          <form onSubmit={onSubmit}>
              <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
              />

              <input
                  type="text"
                  name="startsAt"
                  placeholder="Starts at"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
              />

              <input
                  type="text"
                  name="endsAt"
                  placeholder="Ends at"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
              />

              <button type="submit">Save</button>
              <button onClick={handleCut}>Cut</button>
              </form>
              <button onClick={handleDelete}>DELETE</button>
        </>
    )
}
