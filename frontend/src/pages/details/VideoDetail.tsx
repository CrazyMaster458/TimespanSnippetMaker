/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosClient from "../../api/axios.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button.tsx";
import { SnippetCard } from "../../components/SnippetCard.tsx";
import { Snippet, Tag, Video } from "@/lib/types.ts";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewItem,
  createNewItem,
  getData,
  getQueryData,
  handleSuccess,
} from "@/api/index.ts";
import { EmptyState } from "@/components/EmptyState.tsx";
import { Film } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton.tsx";

type FetchProps = {
  video: Video;
  tags: Tag[];
};

type SnippetTime = {
  starts_at: string;
  ends_at: string;
};

export default function VideoDetail() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const {
    data: videoData,
    isLoading: isVideoDataLoading,
    error: videoDataError,
  } = useQuery({
    queryKey: ["videos", id],
    queryFn: () => getData("/videos/" + id),
  });

  const {
    data: snippetsData,
    isLoading: areSnippetsDataLoading,
    error: snippetsDataError,
  } = useQuery({
    queryKey: ["videos", id, "snippets"],
    queryFn: () => getData("/get-video-snippets/" + id),
  });

  const {
    data: tagsData,
    isLoading: areTagsDataLoading,
    error: tagsDataError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getData("/tags"),
  });

  const [snippetTimes, setSnippetTimes] = useState<SnippetTime | null>();

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

  function handleDelete() {
    axiosClient
      .delete(`/videos/` + id)
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

  const { mutateAsync: createNewSnippet, isPending } = useMutation({
    mutationFn: createNewItem,
    onSuccess: (newItem) => {
      const queryName = ["videos", id, "snippets"];
      handleSuccess({ queryClient, queryName, newItem });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSnippetCreation = () => {
    const endpoint = "/snippets";
    const data = { video_id: id };
    createNewSnippet({ endpoint, data });
  };

  return (
    <>
      <div className="grid grid-cols-7 content-center gap-10">
        <div className="col-span-4">
          {videoData && !isVideoDataLoading && videoData.video_url ? (
            <>
              <AspectRatio ratio={16 / 9}>
                <VideoPlayer
                  videoUrl={videoData.video_url}
                  snippetTimes={snippetTimes ? snippetTimes : null}
                />
              </AspectRatio>
              <div className="pt-3">
                <h3 className="text-left font-sans text-xl font-bold">
                  {videoData.title}
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
              <div className="flex flex-col gap-2 pt-3">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-8 w-48" />
              </div>
            </>
          )}
        </div>
        <div className="col-span-3">
          <ScrollArea className="flex h-[88.5vh] w-[full] flex-col gap-2 overflow-scroll">
            {!areSnippetsDataLoading && !areTagsDataLoading && snippetsData ? (
              snippetsData.length > 0 ? (
                <>
                  {snippetsData.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippetData={snippet}
                      tagsData={tagsData}
                      setSnippetTimes={setSnippetTimes}
                      onClick={() => handleSnippetCardClick(snippet)}
                    />
                  ))}
                  {isPending ? (
                    <>
                      <LoadingButton className="rounded-lg py-7" />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-[full] rounded-lg py-7"
                        onClick={handleSnippetCreation}
                      >
                        Create Snippet
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <EmptyState
                  objectName="Snippet"
                  onClick={handleSnippetCreation}
                  isPending={isPending}
                  icon={<Film />}
                />
              )
            ) : (
              <>
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
                <Skeleton className="w-[full] py-8" />
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
