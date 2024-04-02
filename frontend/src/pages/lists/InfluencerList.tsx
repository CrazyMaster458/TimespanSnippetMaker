/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Influencer } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchInfiniteQuery } from "@/services/queries";
import { useInView } from "react-intersection-observer";
import { InfluencerCard } from "@/components/cards/InfluencerCard";

export default function InfluencerList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const influencerQuery = useSearchInfiniteQuery("influencer-list", queries);

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (
      inView &&
      !influencerQuery.isFetchingNextPage &&
      influencerQuery.hasNextPage
    ) {
      influencerQuery.fetchNextPage();
    }
  }, [inView, influencerQuery.isFetchingNextPage]);

  useEffect(() => {
    influencerQuery.refetch();
  }, [searchParams]);

  return (
    <section>
      <div className="grid grid-cols-4 gap-2 pb-8">
        {influencerQuery.isLoading
          ? Array.from({ length: 40 }).map((_, index) => (
              <Skeleton key={index} className="w-[full] py-6" />
            ))
          : influencerQuery.data &&
              influencerQuery.data.pages[0].data.length > 0
            ? influencerQuery.data.pages.map((page) =>
                page.data.map((influencer: Influencer) => (
                  <InfluencerCard
                    key={influencer.id}
                    influencerData={influencer}
                  />
                )),
              )
            : !influencerQuery.isLoading &&
              !influencerQuery.isFetchingNextPage && (
                <EmptyState
                  objectName="Influencer"
                  icon={<User />}
                  showButton={false}
                />
              )}

        {!influencerQuery.isLoading && influencerQuery.isFetching && null}
        {!influencerQuery.isLoading && influencerQuery.isFetchingNextPage && (
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
