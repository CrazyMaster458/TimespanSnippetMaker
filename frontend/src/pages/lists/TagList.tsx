/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Tag } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { Tag as TagIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchInfiniteQuery } from "@/services/queries";
import { useInView } from "react-intersection-observer";
import { TagCard } from "@/components/cards/TagCard";

export default function InfluencerList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const videoTypeQuery = useSearchInfiniteQuery("tag-list", queries);

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (
      inView &&
      !videoTypeQuery.isFetchingNextPage &&
      videoTypeQuery.hasNextPage
    ) {
      videoTypeQuery.fetchNextPage();
    }
  }, [inView, videoTypeQuery.isFetchingNextPage]);

  useEffect(() => {
    videoTypeQuery.refetch();
  }, [searchParams]);

  return (
    <section>
      <div className="grid grid-cols-4 gap-2 pb-8">
        {videoTypeQuery.isLoading
          ? Array.from({ length: 40 }).map((_, index) => (
              <Skeleton key={index} className="w-[full] py-6" />
            ))
          : videoTypeQuery.data && videoTypeQuery.data.pages[0].data.length > 0
            ? videoTypeQuery.data.pages.map((page) =>
                page.data.map((tag: Tag) => (
                  <TagCard key={tag.id} tagData={tag} />
                )),
              )
            : !videoTypeQuery.isLoading &&
              !videoTypeQuery.isFetchingNextPage && (
                <EmptyState
                  objectName="Tag"
                  icon={<TagIcon />}
                  showButton={false}
                />
              )}

        {!videoTypeQuery.isLoading && videoTypeQuery.isFetching && null}
        {!videoTypeQuery.isLoading && videoTypeQuery.isFetchingNextPage && (
          <>
            <Skeleton className="w-[full] py-4" />
            <Skeleton className="w-[full] py-4" />
            <Skeleton className="w-[full] py-4" />
            <Skeleton className="w-[full] py-4" />
          </>
        )}
      </div>
      <div ref={ref}></div>
    </section>
  );
}
