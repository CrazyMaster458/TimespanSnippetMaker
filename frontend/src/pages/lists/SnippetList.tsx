/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@material-tailwind/react/components/Button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SnippetCard } from "../../components/SnippetCard";
// import { MultiSelect } from "@/components/MultiSelectOld";
import { Snippet, Tag, Option } from "@/lib/types";
import { getData } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { Film, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetList() {
  const { data: snippetsData, isLoading: areSnippetsDataLoading } = useQuery({
    queryKey: ["snippets"],
    queryFn: () => getData("/snippets"),
  });

  const { data: tagsData, isLoading: areTagsDataLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getData("/tags"),
  });

  const [searchParams, setSearchParams] = useSearchParams({
    q: "",
  });
  const searchedQuery = searchParams.get("q");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);

  const handleSnippetCardClick = (videoUrl: string) => {
    setIsOpen(true);
    setSelectedSnippet(videoUrl);
  };

  const handleHideClick = () => {
    setIsOpen(false);
  };

  const filteredSnippets = useMemo(() => {
    if (!snippetsData) return [];

    let filtered = [...snippetsData];

    if (searchedQuery) {
      filtered = filtered.filter((snippet) =>
        snippet.description.toLowerCase().includes(searchedQuery.toLowerCase()),
      );
    }

    // if (selectedTags && selectedTags.length > 0) {
    //   filtered = filtered.filter((snippet) =>
    //     selectedTags.some((tag) => tag.value === snippet.id),
    //   );
    // }

    return filtered.map((snippet) => (
      <SnippetCard
        key={snippet.id}
        tagsData={tagsData}
        snippetData={snippet}
        onClick={() => handleSnippetCardClick(snippet.video_url)}
      />
    ));
  }, [snippetsData, tagsData, selectedTags, searchedQuery]);

  const handleRedirect = () => {};

  return (
    <div>
      <div className="grow">
        <ScrollArea className="h-[80.7vh] w-[full] overflow-hidden pr-5">
          <div className="flex flex-col gap-1.5">
            {/* {snippetsData &&
              tagsData &&
              snippetsData.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  tagsData={tagsData}
                  snippetData={snippet}
                  onClick={() => handleSnippetCardClick(snippet.video_url)}
                />
              ))} */}

            {areSnippetsDataLoading || areTagsDataLoading ? (
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
            ) : filteredSnippets.length > 0 ? (
              filteredSnippets
            ) : (
              <EmptyState
                objectName="Snippet"
                onClick={handleRedirect}
                icon={<Film />}
              />
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
