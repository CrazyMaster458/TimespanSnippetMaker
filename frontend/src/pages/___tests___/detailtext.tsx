import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useParams } from "react-router-dom";
import { Snippet } from "@/components/___tests___/snippet.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function DetailForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [videoDetailData, setVideoDetailData] = useState(null);
  const [snippetData, setSnippetData] = useState(null);
  const [snippets, setSnippets] = useState<JSX.Element[]>([]); // State to track an array of snippets
  const { id } = useParams();

  useEffect(() => {
    axiosClient
      .get(`/video/${id}`)
      .then(({ data }) => {
        console.log(data.data);
        setVideoDetailData(data.data);
        setSnippetData(data.data.snippets)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    if (snippetData) {
      setSnippetData(snippetData);

      setSnippets(snippetData.map((snippet) => (
        <Snippet key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
      )));
    }
  }, [snippetData, id]);

  function createSnippet(){    
    axiosClient
      .post("/snippet", {
        video_type_id: 1,
        video_id: id,
      })
      .then(({ data }) => {
        console.log(data);
        setSnippetData((prevData) => [...prevData, data.data]);

        console.log(snippetData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleShowSnippet() {
    // Add a new snippet to the array each time the button is clicked
    createSnippet();
    // setSnippets([...snippets, <Snippet key={snippets.length} videoId={id}/>]);
  }

  return (
    <>
      <h1 className="pt-16">Signup</h1>

      <p>{id}</p>
      
      <div className="flex flex-row justify-between">
        <div>
          {videoDetailData && videoDetailData.video_url ?
            <>
              <video controls>
                  <source src={videoDetailData.video_url} type="video/mp4"/>
              </video>
            </>
            : <p>Loading...</p>} 
        </div>
        <div>
          {snippets.length > 0 ? snippets : <p>Loading...</p>}

          <button onClick={handleShowSnippet}>Create Snippet</button>
        </div>
      </div>

    </>
  );
}
