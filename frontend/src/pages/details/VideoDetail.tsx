/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button.tsx";
import { SnippetCard } from "../../components/SnippetCard.tsx";
import { useSnippetsDataStore, useTagsDataStore } from "../../utils/StateStore.tsx";
import { Snippet, Video } from "@/types/type.ts";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function VideoDetail() {
  //   const { userToken, currentUser } = useStateContext();
  const [videoDetailData, setVideoDetailData] = useState<Video | null>(null);
  const [snippets, setSnippets] = useState<JSX.Element[]>([]);
  const [snippetTimes, setSnippetTimes] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const { tagsData, setTagsData } = useTagsDataStore((state) => ({
    tagsData: state.tagsData,
    setTagsData: state.setTagsData,
  }));

  const { snippetsData, setSnippetsData, addSnippet } = useSnippetsDataStore((state) => ({
    snippetsData: state.snippetsData,
    setSnippetsData: state.setSnippetsData,
    addSnippet: state.addSnippet,
  }));


  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/listview`);
  };

  const handleSnippetCardClick = (snippet: Snippet) => {
    setSnippetTimes({
      snippetStart: snippet.starts_at,
      snippetEnd: snippet.ends_at,
    });
  }

  useEffect(() => {console.log(tagsData)}, [tagsData]);

  useEffect(() => {
    axiosClient
      .get(`/get_video_data/${id}`)
      .then(({ data }) => {
        console.log(data);
        setVideoDetailData(data.video);
        setSnippetsData(data.video.snippets);
        setTagsData(data.tags);
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
    if (snippetsData && tagsData) {
      // setSnippetsData(snippetsData);

      setSnippets(snippetsData.map((snippet) => (
        <SnippetCard key={snippet.id} snippetData={snippet} tagsData={tagsData} setSnippetTimes={setSnippetTimes}
        onClick={() => handleSnippetCardClick(snippet)}/>
        // <Snippet key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
      )));
      setLoading(false);
    }
  }, [snippetsData, tagsData]);

  const createSnippet = () => {    
    axiosClient
      .post("/snippet", {
        video_type_id: 1,
        video_id: id,
      })
      .then(({ data }) => {
        console.log(data);
        addSnippet(data.data)
        console.log(snippetsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // const updateSnippet = (updatedSnippet) => {
  //   console.log(updatedSnippet)

  //   setSnippetData((currentSnippets) => 
  //     currentSnippets.map((snippet) => 
  //       snippet.id === updatedSnippet.id ? updatedSnippet : snippet
  //     )
  //   );

  //   handleSnippetCardClick(updatedSnippet);

  //   // setSnippetTimes({
  //   //   snippetStart: updatedSnippet.starts_at,
  //   //   snippetEnd: updatedSnippet.ends_at,
  //   // });
  //   // filterSnippets();
  // };

  return (
    <>      
      <div className="grid grid-cols-7 gap-2 content-center">
        <div className="col-span-4">
          {videoDetailData && videoDetailData.video_url ?
            <>
              <VideoPlayer videoUrl={videoDetailData.video_url} snippetTimes={snippetTimes ? snippetTimes : null}/>
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
