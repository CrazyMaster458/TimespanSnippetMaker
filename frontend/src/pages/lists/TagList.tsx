import { getData } from "@/api";
import { EmptyState } from "@/components/EmptyState";
import { TagCard } from "@/components/TagCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search, Tag } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function TagList() {
  const { data: tagsData, isLoading: areTagsDataLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getData("/tags"),
  });

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
  });
  const searchedQuery = searchParams.get("q");

  const filteredTags = useMemo(() => {
    if (!tagsData) return [];

    let filtered = [...tagsData];

    if (searchedQuery) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    return filtered.map((tag) => <TagCard tagData={tag} />);
  }, [tagsData, searchedQuery]);

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
        {areTagsDataLoading ? (
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
        ) : filteredTags.length > 0 ? (
          filteredTags
        ) : (
          <EmptyState
            objectName="Tag"
            onClick={handleRedirect}
            icon={<Tag />}
          />
        )}
      </section>
    </>
  );
}
