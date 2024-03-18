/* eslint-disable react-hooks/exhaustive-deps */
import { VideoCard } from "@/components/VideoCard";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { SelectCreate } from "@/components/Select";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Search, VideoOff } from "lucide-react";
import { EmptyState } from "@/components/EmptyState.tsx";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/index.ts";
import {
  SimpleProp,
  Option,
  influencerSchema,
  videoTypeSchema,
} from "@/lib/types";

import { SimpleSelect } from "@/components/Select copy";
import { UploadFileDialog2 } from "@/components/UploadFileDialog copy";

export default function VideoList() {
  const navigate = useNavigate();
  const {
    data: videosData,
    isLoading: areVideosDataLoading,
    error,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getData("/videos"),
  });

  const { data: videoTypesData, isLoading: areVideoTypesDataLoading } =
    useQuery({
      queryKey: ["video_types"],
      queryFn: () => getData("/video_types"),
    });

  const { data: influencersData, isLoading: areInfluencersDataLoading } =
    useQuery({
      queryKey: ["influencers"],
      queryFn: () => getData("/influencers"),
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
    vt: "",
    i: "",
  });
  const searchedQuery = searchParams.get("q");
  const searchedVideoTypeQuery = searchParams.get("vt");
  const searchedInfluencersQuery = searchParams.get("vt");

  const [videoType, setVideoType] = useState<number[]>([]);
  const [influencers, setInfluencers] = useState<number[]>([]);

  const [selectedVideoType, setSelectedVideoType] = useState<Option[]>([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState<Option[]>([]);

  useEffect(() => {
    // Set selected video type based on URL parameter when component mounts
    const vtParam = searchParams.get("vt");
    if (vtParam) {
      const selectedOptions = vtParam
        .split(",")
        .map((value) => parseInt(value));
      setVideoType(selectedOptions);
    }
  }, [searchParams]);

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
  }, [videosData, selectedVideoType, selectedInfluencers, searchedQuery]);

  return (
    <>
      <div className="flex flex-row place-content-center place-items-center content-center items-center justify-between pb-5">
        {!areInfluencersDataLoading && !areVideoTypesDataLoading ? (
          <>
            <section className="flex flex-row gap-4">
              {/* <span className="w-[15rem]">
                <Select
                  data={videoTypesData}
                  endpoint="video_types"
                  selectedOptions={selectedVideoType}
                  setSelectedOptions={setSelectedVideoType}
                  placeholder="Select Video Type"
                  schema={videoTypeSchema}
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
                  schema={influencerSchema}
                />
              </span> */}
              <span className="w-[15rem]">
                <SimpleSelect
                  data={videoTypesData}
                  selectedOptions={videoType}
                  setSelectedOptions={setVideoType}
                  isMulti={true}
                  placeholder="Select Video Type"
                />
              </span>
              <span className="w-[15rem]">
                <SimpleSelect
                  data={influencersData}
                  selectedOptions={influencers}
                  setSelectedOptions={setInfluencers}
                  isMulti={true}
                  placeholder="Select Influencers"
                />
              </span>
            </section>

            <section className="w-[30rem]">
              <label className="input input-bordered input-md flex items-center gap-2">
                <input
                  type="search"
                  className="grow"
                  placeholder="Search"
                  value={searchedQuery}
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
            onClick={handleRedirect}
            icon={<VideoOff />}
          />
        )}
      </section>
    </>
  );
}
