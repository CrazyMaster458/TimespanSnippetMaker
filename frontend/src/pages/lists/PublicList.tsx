/* eslint-disable react-hooks/exhaustive-deps */
import { VideoCard } from "@/components/cards/VideoCard";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Search, VideoOff } from "lucide-react";
import { EmptyState } from "@/components/EmptyState.tsx";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/api";
import { useStateContext } from "@/contexts/ContextProvider";

export default function PublicList() {
  const navigate = useNavigate();
  const { currentUser } = useStateContext();
  const { data: videosData, isLoading: areVideosDataLoading } = useQuery({
    queryKey: ["public-videos"],
    queryFn: () => getData("/public"),
  });

  // useEffect(() => {
  //   console.log(influencersData);
  // }, [influencersData]);
  // useEffect(() => {
  //   console.log(videosData);
  // }, [videosData]);
  // useEffect(() => {
  //   console.log(videoTypesData);
  // }, [videoTypesData]);

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
  });
  const searchedQuery = searchParams.get("q");

  const handleRedirect = () => {
    navigate(`/cardform`);
  };

  const filteredVideos = useMemo(() => {
    if (!videosData) return [];

    let filtered = [...videosData];

    if (searchedQuery) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    return filtered.map((video) => (
      <VideoCard
        key={video.id}
        videoData={video}
        user={currentUser}
        publicView={true}
      />
    ));
  }, [videosData, searchedQuery]);

  return (
    <>
      <div className="flex flex-row place-content-center place-items-center content-center items-center justify-between pb-5">
        <section className="w-[30rem]">
          <label className="input input-bordered input-md flex items-center gap-2">
            <input
              type="search"
              className="grow"
              placeholder="Search"
              value={searchedQuery || ""}
              onChange={(e) =>
                setSearchParams(
                  (prev) => {
                    prev.set("q", e.target.value);
                    return prev;
                  },
                  { replace: true },
                )
              }
            />
            <Search className="w-[1.2rem]" />
          </label>
          {/* <SearchBar search={searchedTerm} setSearch={setSearchParams} /> */}
        </section>
      </div>

      <section className="grid grid-cols-4 gap-4 pb-8">
        {areVideosDataLoading ? (
          <>
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
            <Skeleton className="h-[250px] w-[full]" />
          </>
        ) : filteredVideos.length > 0 ? (
          filteredVideos
        ) : (
          <EmptyState
            objectName="Video"
            onClick={handleRedirect}
            icon={<VideoOff />}
          />
        )}
      </section>
    </>
  );
}
