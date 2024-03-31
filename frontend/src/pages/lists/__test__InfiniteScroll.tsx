/* eslint-disable react-hooks/exhaustive-deps */
import { VideoCard } from "@/components/cards/VideoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useStateContext } from "@/contexts/ContextProvider";
import { getPages } from "@/services/api";
import { useGetQuery, useInfiniteVideosQuery } from "@/services/queries";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function InfiniteScrollTest() {
  const { currentUser } = useStateContext();

  // const productsQuery = useInfiniteVideosQuery();
  const {
    data,
    error,
    status,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteVideosQuery();

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (inView && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage]);

  // const { data: videosData, isLoading: areVideosDataLoading } =
  //   useGetQuery("videos");

  useEffect(() => {
    // const fetchFirstPage = async () => {
    //   try {
    //     const response = await getPages({ pageParam: 1 });
    //     console.log("response", response);
    //   } catch (error) {
    //     console.error("Error fetching first page:", error);
    //   }
    // };

    // fetchFirstPage();
    console.log("data", data);
  }, [data]);

  return (
    <>
      {/* {productsQuery.data?.pages.map((group, index) => (
        <Fragment key={index}>
          {group.map((video: any) => (
            <VideoCard key={video.id} videoData={video} user={currentUser} />
          ))}
        </Fragment>
      ))} */}
      <div className="grid grid-cols-4 gap-4 pb-8">
        {data &&
          data.pages.map((page) =>
            page.data.map((video) => (
              <VideoCard key={video.id} videoData={video} user={currentUser} />
            )),
          )}
        {isFetching && (
          <>
            {/* <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" /> */}
          </>
        )}
        {isFetchingNextPage && (
          <>
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
          </>
        )}
      </div>
      <div ref={ref}></div>

      {/* <section>
        {areVideosDataLoading ? (
          <p>Loading...</p>
        ) : (
          <section className="grid grid-cols-4 gap-4 pb-8">
            {videosData?.map((video: any) => (
              <VideoCard key={video.id} videoData={video} user={currentUser} />
            ))}
          </section>
        )}
      </section> */}
    </>
  );
}
