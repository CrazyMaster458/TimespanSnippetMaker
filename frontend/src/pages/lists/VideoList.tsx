/* eslint-disable react-hooks/exhaustive-deps */
import { VideoCard } from "@/components/VideoCard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { Select } from "@/components/Select";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { VideoOff } from "lucide-react";
import { EmptyState } from "@/components/EmptyState.tsx";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchData, fetchPost } from "@/api/index.ts";
import { Option } from "@/types/types";

export default function VideoList() {
  const {
    data: videosData,
    isLoading: areVideosDataLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: () => fetchData("/videos"),
  });

  const { data: videoTypesData, isLoading: areVideoTypesDataLoading } =
    useQuery({
      queryKey: ["video_types"],
      queryFn: () => fetchData("/video_types"),
    });

  const { data: influencersData, isLoading: areInfluencersDataLoading } =
    useQuery({
      queryKey: ["influencers"],
      queryFn: () => fetchData("/influencers"),
    });

  // const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
  //   queryKey: ["videos"],
  //   queryFn: async ({ pageParam = 1 }) => {
  //     const response = await fetchPost("/videos", pageParam);
  //     return response;
  //   },
  //   getNextPageParam: (lastPage) => lastPage.length + 1,
  //   initialPageParam: 1,
  // });

  // useEffect(() => {
  //   console.log(influencersData);
  // }, [influencersData]);
  // useEffect(() => {
  //   console.log(videosData);
  // }, [videosData]);
  // useEffect(() => {
  //   console.log(videoTypesData);
  // }, [videoTypesData]);

  const [selectedVideoType, setSelectedVideoType] = useState<Option[]>([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState<Option[]>([]);
  const [searchedTerm, setSearchedTerm] = useState("");

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/cardform`);
  };

  const filteredVideos = useMemo(() => {
    if (!videosData) return [];

    let filtered = [...videosData];

    if (searchedTerm) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchedTerm.toLowerCase()),
      );
    }

    if (selectedVideoType && selectedVideoType.length > 0) {
      filtered = filtered.filter(
        (video) => video.video_type.id === selectedVideoType[0].value,
      );
    }

    if (selectedInfluencers && selectedInfluencers.length > 0) {
      filtered = filtered.filter((video) =>
        selectedInfluencers.some((v) => v.value === video.host_id.id),
      );
    }

    return filtered.map((video) => (
      <VideoCard key={video.id} videoData={video} />
    ));
  }, [videosData, selectedVideoType, selectedInfluencers, searchedTerm]);

  return (
    <>
      <div className="flex flex-row place-content-center place-items-center content-center items-center justify-between pb-5">
        {!areInfluencersDataLoading && !areVideoTypesDataLoading ? (
          <>
            <section className="flex flex-row gap-4">
              <span className="w-[15rem]">
                <Select
                  data={videoTypesData}
                  endpoint="video_types"
                  selectedOptions={selectedVideoType}
                  setSelectedOptions={setSelectedVideoType}
                  placeholder="Select Video Type"
                />
              </span>
              <span className="w-[15rem]">
                <Select
                  data={influencersData}
                  endpoint="influencers"
                  selectedOptions={selectedInfluencers}
                  setSelectedOptions={setSelectedInfluencers}
                  isMulti={true}
                  placeholder="Select Influencers"
                />
              </span>
            </section>

            <section className="w-[30rem]">
              <SearchBar search={searchedTerm} setSearch={setSearchedTerm} />
            </section>
          </>
        ) : (
          <>
            <section className="flex flex-row gap-4">
              <Skeleton className="h-12 w-[15rem]" />
              <Skeleton className="h-12 w-[15rem]" />
            </section>
            <Skeleton className="h-12 w-[30rem]" />
          </>
        )}
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
            onActionClick={handleRedirect}
            icon={<VideoOff />}
          />
        )}
      </section>
    </>
  );
}
