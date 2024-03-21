import { getData } from "@/api";
import { EmptyState } from "@/components/EmptyState";
import { InfluencerCard } from "@/components/InfluencerCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function InfluencerList() {
  const { data: influencersData, isLoading: areInfluencersDataLoading } =
    useQuery({
      queryKey: ["influencers"],
      queryFn: () => getData("/influencers"),
    });

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
  });
  const searchedQuery = searchParams.get("q");

  const filteredInfluencers = useMemo(() => {
    if (!influencersData) return [];

    let filtered = [...influencersData];

    if (searchedQuery) {
      filtered = filtered.filter((influencer) =>
        influencer.name.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    return filtered.map((influencer) => (
      <InfluencerCard influencerData={influencer} />
    ));
  }, [influencersData, searchedQuery]);

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
        {areInfluencersDataLoading ? (
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
        ) : filteredInfluencers.length > 0 ? (
          filteredInfluencers
        ) : (
          <EmptyState
            objectName="Influencer"
            onClick={handleRedirect}
            icon={<Users />}
          />
        )}
      </section>
    </>
  );
}
