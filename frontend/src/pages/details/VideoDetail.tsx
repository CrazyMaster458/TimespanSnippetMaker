/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button.tsx";
import { SnippetCard } from "../../components/SnippetCard.tsx";
import {
  useSnippetsDataStore,
  useTagsDataStore,
} from "../../utils/StateStore.tsx";
import { Snippet, Tag, Video } from "@/types/types.ts";
import { useFetch } from "@/utils/useFetch.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type FetchProps = {
  video: Video;
  tags: Tag[];
};

type SnippetTime = {
  starts_at: string;
  ends_at: string;
};

export default function VideoDetail() {
  //   const { userToken, currentUser } = useStateContext();
  const [snippets, setSnippets] = useState<JSX.Element[]>([]);
  const [snippetTimes, setSnippetTimes] = useState<SnippetTime | null>();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const { tagsData, setTagsData } = useTagsDataStore((state) => ({
    tagsData: state.tagsData,
    setTagsData: state.setTagsData,
  }));

  const { snippetsData, setSnippetsData, addSnippet } = useSnippetsDataStore(
    (state) => ({
      snippetsData: state.snippetsData,
      setSnippetsData: state.setSnippetsData,
      addSnippet: state.addSnippet,
    }),
  );

  const navigate = useNavigate();

  const HandleRedirect = () => {
    navigate(`/listview`);
  };

  const handleSnippetCardClick = (snippet: Snippet) => {
    setSnippetTimes({
      starts_at: snippet.starts_at,
      ends_at: snippet.ends_at,
    });
  };

  const { data, isPending, error } = useFetch<FetchProps>(
    `/get_video_data/${id}`,
  );

  useEffect(() => {
    if (data && !isPending) {
      setSnippetsData(data.video.snippets);
      setTagsData(data.tags);
    }
  }, [data]);

  function handleDelete() {
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
    setSnippets((prevSnippets) =>
      prevSnippets.filter(
        (snippet) => snippet.props.snippetId !== deletedSnippetId,
      ),
    );
  }

  useEffect(() => {
    if (snippetsData && tagsData) {
      setSnippets(
        snippetsData.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippetData={snippet}
            tagsData={tagsData}
            setSnippetTimes={setSnippetTimes}
            onClick={() => handleSnippetCardClick(snippet)}
          />
          // <Snippet key={snippet.id} videoId={id} snippetData={snippet} snippetId={snippet.id}/>
        )),
      );
      setLoading(false);
    }
  }, [snippetsData, tagsData]);

  const createSnippet = async () => {
    try {
      const response = await axiosClient.post("/snippet", {
        video_type_id: 1,
        video_id: id,
      });

      // console.log(response.data);
      addSnippet(response.data.data);
      // console.log(snippetsData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-7 content-center gap-2">
        <div className="col-span-4">
          {data?.video && data?.video.video_url ? (
            <>
              <VideoPlayer
                videoUrl={data?.video.video_url}
                snippetTimes={snippetTimes ? snippetTimes : null}
              />
              <div className="pt-2">
                <h3 className="text-left font-sans text-xl font-bold">
                  {data?.video.title}
                </h3>
                <Button
                  variant="outline"
                  className="bg-red-500"
                  onClick={handleDelete}
                >
                  DELETE
                </Button>
              </div>
            </>
          ) : (
            <>
              <AspectRatio ratio={16 / 9}>
                <Skeleton className="h-[100%] w-[100%] rounded-xl" />
              </AspectRatio>
              <div className="pt-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
            </>
          )}
        </div>
        <div className="col-span-3">
          <ScrollArea className="flex h-[88.5vh] w-[full] flex-col overflow-scroll">
            {!loading ? (
              snippets !== null ? (
                snippets.length > 0 ? (
                  snippets
                ) : (
                  <p>No data found...</p>
                )
              ) : (
                <p>No data found.</p>
              )
            ) : (
              <p>Loading...</p>
            )}
            <Button variant="outline" onClick={createSnippet}>
              Create Snippet
            </Button>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
