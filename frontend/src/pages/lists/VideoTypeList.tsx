import { getData } from "@/api";
import { EmptyState } from "@/components/EmptyState";
import { VideoTypeCard } from "@/components/VideoTypeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search, Tv } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function VideoTypeList() {
  const { data: videoTypesData, isLoading: areVideoTypesDataLoading } =
    useQuery({
      queryKey: ["video_types"],
      queryFn: () => getData("/video_types"),
    });

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
  });
  const searchedQuery = searchParams.get("q");

  const filteredVideoTypes = useMemo(() => {
    if (!videoTypesData) return [];

    let filtered = [...videoTypesData];

    if (searchedQuery) {
      filtered = filtered.filter((videoType) =>
        videoType.name.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    return filtered.map((videoType) => (
      <VideoTypeCard videoTypeData={videoType} />
    ));
  }, [videoTypesData, searchedQuery]);

  const handleRedirect = () => {};

  return (
    <>
      <div className="flex flex-row place-content-center place-items-center content-center items-center pb-5">
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
        </section>
      </div>

      <section className="grid grid-cols-4 gap-2 pb-8">
        {areVideoTypesDataLoading ? (
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
        ) : filteredVideoTypes.length > 0 ? (
          filteredVideoTypes
        ) : (
          <EmptyState
            objectName="Video Type"
            onClick={handleRedirect}
            icon={<Tv />}
          />
        )}
      </section>
    </>
  );
}
