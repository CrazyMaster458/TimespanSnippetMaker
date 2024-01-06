import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useParams } from "react-router-dom";
import { Snippet } from "@/components/___tests___/snippet.tsx";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SnippetCard } from "@/components/SnippetCard.tsx";
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
        <SnippetCard key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
        // <Snippet key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
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

  return (
    <>      
      <div className="grid grid-cols-7 gap-2 content-center pt-20">
        <div className="col-span-4">
          {videoDetailData && videoDetailData.video_url ?
            <>
              <VideoPlayer videoUrl={videoDetailData.video_url}/>
              <h3 className="pl-10 font-bold font-sans text-left text-xl pt-2">{videoDetailData.title}</h3>
            </>
            : <p>Loading...</p>
          } 
        </div>
        <div className="col-span-3">
          {snippets.length > 0 ?
          
          <ScrollArea className="h-[684px] w-[full] flex flex-col pr-12">
            {snippets}
            <button onClick={createSnippet}>Create Snippet</button>
          </ScrollArea>

            : <p>Loading...</p>
          }

        </div>
      </div>

    </>
  );
}
