/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { SnippetCard } from "../../components/cards/SnippetCard";
import { Snippet } from "@/lib/types";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetQuery, useSearchInfiniteQuery } from "@/services/queries";
import { useInView } from "react-intersection-observer";

export default function SnippetList() {
  const [searchParams] = useSearchParams();

  const queries = searchParams.toString();

  const snippetQuery = useSearchInfiniteQuery("snippets", queries);

  const { data: tagsData, isLoading: areTagsDataLoading } = useGetQuery(
    "tags",
    !snippetQuery.isLoading,
  );

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (
      inView &&
      !snippetQuery.isFetchingNextPage &&
      snippetQuery.hasNextPage
    ) {
      snippetQuery.fetchNextPage();
    }
  }, [inView, snippetQuery.isFetchingNextPage]);

  useEffect(() => {
    snippetQuery.refetch();
  }, [searchParams]);

  return (
    <section>
      <div className="flex flex-col gap-1.5 pb-8">
        {snippetQuery.isLoading || areTagsDataLoading ? (
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
        ) : snippetQuery.data && snippetQuery.data.pages[0].data.length > 0 ? (
          snippetQuery.data.pages.map((page) =>
            page.data.map((snippet: Snippet) => (
              <SnippetCard
                key={snippet.id}
                tagsData={tagsData}
                snippetData={snippet}
              />
            )),
          )
        ) : (
          !snippetQuery.isLoading &&
          !snippetQuery.isFetchingNextPage && (
            <EmptyState
              objectName="Snippet"
              icon={<Film />}
              showButton={false}
            />
          )
        )}

        {!snippetQuery.isLoading && snippetQuery.isFetching && null}
        {!snippetQuery.isLoading && snippetQuery.isFetchingNextPage && (
          <>
            <Skeleton className="w-[full] py-8" />
            <Skeleton className="w-[full] py-8" />
            <Skeleton className="w-[full] py-8" />
            <Skeleton className="w-[full] py-8" />
          </>
        )}
      </div>
      <div ref={ref}></div>
    </section>
  );
}
