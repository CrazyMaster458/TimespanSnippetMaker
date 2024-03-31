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

  const handleRedirect = () => {};

  return (
    <section>
      <div className="flex flex-col gap-1.5">
        {snippetQuery.isLoading || snippetQuery.isFetching ? (
          <>
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
          </>
        ) : snippetQuery.data && snippetQuery.data.pages.length > 1 ? (
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
          !snippetQuery.isFetching &&
          !snippetQuery.isFetchingNextPage && (
            <EmptyState
              objectName="Video"
              onClick={handleRedirect}
              icon={<Film />}
            />
          )
        )}

        {!snippetQuery.isLoading && snippetQuery.isFetching && null}
        {!snippetQuery.isLoading && snippetQuery.isFetchingNextPage && (
          <>
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
          </>
        )}
      </div>
      <div ref={ref}></div>
    </section>
  );
}
