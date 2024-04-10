/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { VideoPlayer } from "@/components/VideoPlayer.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button.tsx";
import { SnippetCard } from "../../components/cards/SnippetCard.tsx";
import { Snippet } from "@/lib/types.ts";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { EmptyState } from "@/components/EmptyState.tsx";
import { Film } from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton.tsx";
import { useStateContext } from "@/contexts/ContextProvider.tsx";
import {
  useItemQuery,
  useGetQuery,
  useVideoSnippetsQuery,
} from "@/services/queries.ts";
import {
  useCreateSnippetMutation,
  useDuplicateMutation,
} from "@/services/mutations.ts";

export default function VideoDetail() {
  const { currentUser } = useStateContext();
  const { id } = useParams();

  const parsedId = id ? parseInt(id) : undefined;
  const { data: videoData, isLoading: isVideoDataLoading } = useItemQuery(
    "videos",
    parsedId,
  );

  const { data: tagsData, isLoading: areTagsDataLoading } = useGetQuery(
    "tags",
    !isVideoDataLoading,
  );

  const { data: snippetsData, isLoading: areSnippetsDataLoading } =
    useVideoSnippetsQuery("get-video-snippets", parsedId, !isVideoDataLoading);

  const isEditable = videoData?.published
    ? currentUser?.id === videoData.user_id
      ? true
      : false
    : true;

  const { mutateAsync: duplicateMutation, isPending: isDuplicationPending } =
    useDuplicateMutation("videos");

  const handleDuplicate = async () => {
    await duplicateMutation(parsedId!);
  };

  const { mutateAsync: makeSnippet, isPending } =
    useCreateSnippetMutation(parsedId);

  const handleSnippetCreation = async () => {
    await makeSnippet({ video_id: parsedId });
  };

  return (
    <>
      <div className="grid grid-cols-7 content-center gap-10">
        <div className="col-span-4">
          {videoData && !isVideoDataLoading && videoData.video_url ? (
            <>
              <AspectRatio ratio={16 / 9}>
                <VideoPlayer videoUrl={videoData.video_url} />
              </AspectRatio>
              <div className="pt-3">
                <h3 className=" text-left font-sans text-xl font-bold">
                  <span
                    style={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                    }}
                  >
                    {videoData.title}
                  </span>
                </h3>
                {!isEditable &&
                  (isDuplicationPending ? (
                    <LoadingButton />
                  ) : (
                    <Button variant="outline" onClick={handleDuplicate}>
                      Duplicate
                    </Button>
                  ))}
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
                  {snippetsData.map((snippet: Snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippetData={snippet}
                      tagsData={tagsData}
                      isEditable={isEditable}
                      parent="video"
                      maxDuration={videoData.duration}
                    />
                  ))}
                  {isPending ? (
                    <>
                      <LoadingButton className="rounded-lg py-7" />
                    </>
                  ) : (
                    isEditable && (
                      <>
                        <Button
                          variant="outline"
                          className="w-[full] rounded-lg py-7"
                          onClick={handleSnippetCreation}
                        >
                          Create Snippet
                        </Button>
                      </>
                    )
                  )}
                </>
              ) : (
                <EmptyState
                  objectName="Snippet"
                  onClick={handleSnippetCreation}
                  isPending={isPending}
                  icon={<Film />}
                  showButton={
                    !videoData.published ||
                    currentUser?.id === videoData.user_id
                  }
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
