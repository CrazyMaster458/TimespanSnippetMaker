/* eslint-disable react-hooks/exhaustive-deps */
import { VideoCard } from "@/components/cards/VideoCard";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Video } from "@/lib/types";

import { useStateContext } from "@/contexts/ContextProvider";
import { useSearchInfiniteQuery } from "@/services/queries";
import { useInView } from "react-intersection-observer";
import { EmptyState } from "@/components/EmptyState";
import { VideoOff } from "lucide-react";

export default function VideoList() {
  const { currentUser } = useStateContext();

  const handleRedirect = () => {};

  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const videoQuery = useSearchInfiniteQuery("videos", queries);

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (inView && !videoQuery.isFetchingNextPage && videoQuery.hasNextPage) {
      videoQuery.fetchNextPage();
    }
  }, [inView, videoQuery.isFetchingNextPage]);

  useEffect(() => {
    videoQuery.refetch();
  }, [searchParams]);

  return (
    <>
      <section>
        <div className="grid grid-cols-4 gap-4 pb-8">
          {videoQuery.isLoading
            ? Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-[270px] w-[full]" />
              ))
            : videoQuery.data && videoQuery.data.pages[0].data.length > 0
              ? videoQuery.data.pages.map((page) =>
                  page.data.map((video: Video) => (
                    <VideoCard
                      key={video.id}
                      videoData={video}
                      user={currentUser}
                    />
                  )),
                )
              : !videoQuery.isLoading &&
                !videoQuery.isFetching &&
                !videoQuery.isFetchingNextPage && (
                  <EmptyState
                    objectName="Video"
                    onClick={handleRedirect}
                    icon={<VideoOff />}
                  />
                )}

          {!videoQuery.isLoading && videoQuery.isFetching && null}
          {!videoQuery.isLoading &&
            videoQuery.isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-[270px] w-[full]" />
            ))}
        </div>
        <div ref={ref}></div>
      </section>
    </>
  );
}
