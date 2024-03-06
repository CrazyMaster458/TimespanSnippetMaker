import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Snippet } from "@/components/___tests___/snippet.tsx";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SnippetCardOld } from "@/components/SnippetCardOld.tsx";
import { isNullOrUndefined } from "util";
import { Button } from "@/components/ui/button.tsx";
import { Accordion2, SnippetCard } from "../SnippetCard.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function DetailForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [videoDetailData, setVideoDetailData] = useState(null);
  const [snippetData, setSnippetData] = useState(null);
  const [tagsData, setTagsData] = useState(null);
  const [snippets, setSnippets] = useState<JSX.Element[]>([]); // State to track an array of snippets
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/listview`);
  };

  useEffect(() => {
    axiosClient
      .get(`/get_video_data/${id}`)
      .then(({ data }) => {
        console.log(data);
        setVideoDetailData(data.video);
        setSnippetData(data.video.snippets)
        setTagsData(data.tags)
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  function handleDelete(){
    axiosClient
    .delete(`/video/` + id)
    .then(({ data }) => {
      console.log(data.data);
      HandleRedirect();
    })
    .catch((error) => {
      console.log(error);
    });
  }


  function updateSnippetsAfterDelete(deletedSnippetId) {
    setSnippets(prevSnippets => prevSnippets.filter(snippet => snippet.props.snippetId !== deletedSnippetId));
  }

  useEffect(() => {
    if (snippetData) {
      setSnippetData(snippetData);

      setSnippets(snippetData.map((snippet) => (
        <SnippetCard key={snippet.id} snippetData={snippet} tagsData={tagsData} setTagsData={setTagsData}/>
        // <Snippet key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
      )));
      setLoading(false);
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
      <div className="grid grid-cols-7 gap-2 content-center">
        <div className="col-span-4">
          {videoDetailData && videoDetailData.video_url ?
            <>
              <VideoPlayer videoUrl={videoDetailData.video_url}/>
              <div className="pt-2">
                <h3 className="font-bold font-sans text-left text-xl">{videoDetailData.title}</h3>
                <Button variant="outline" className="bg-red-500" onClick={handleDelete}>DELETE</Button>
              </div>

            </>
            : <p>Loading...</p>
          } 
        </div>
        <div className="col-span-3">
        <ScrollArea className="h-[88.5vh] w-[full] flex flex-col overflow-scroll">

          {!loading ? snippets !== null ?
            snippets.length > 0 ? snippets : <p>No data found...</p>
            
            : <p>No data found.</p>
            : <p>Loading...</p>
          }
            <Button variant="outline" onClick={createSnippet}>Create Snippet</Button>
        </ScrollArea>

        </div>
      </div>

    </>
  );
}
