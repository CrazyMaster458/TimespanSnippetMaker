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

export default function SnippetListCopy() {
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

  const [searchedTerm, setSearchedTerm] = useState("");
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

  const updateSnippet = (updatedSnippet) => {};

  // const filteredSnippets = useMemo(() => {
  //   if (!snippetsData) return [];

  //   let filtered = [...snippetsData];

  //   if (searchedQuery) {
  //     filtered = filtered.filter((snippet) =>
  //       snippet.description.toLowerCase().includes(searchedQuery.toLowerCase()),
  //     );
  //   }

  //   // if (selectedTags && selectedTags.length > 0) {
  //   //   filtered = filtered.filter((snippet) =>
  //   //     selectedTags.some((tag) => tag.value === snippet.id),
  //   //   );
  //   // }

  //   return filtered.map((snippet) => (
  //     <SnippetCard
  //       key={snippet.id}
  //       tagsData={tagsData}
  //       snippetData={snippet}
  //       onUpdate={updateSnippet}
  //       onClick={() => handleSnippetCardClick(snippet.video_url)}
  //     />
  //   ));
  // }, [snippetsData, tagsData, selectedTags, searchedTerm]);

  const handleRedirect = () => {};

  return (
    <div>
      <div className="flex flex-row place-content-center place-items-center content-center items-center justify-between">
        {tagsData && snippetsData ? (
          <>
            <div className="flex flex-row gap-4">
              <div className="w-[15rem]">
                {/* <MultiSelect
                  data={tagsData}
                  endpoint="tags"
                  value={tags}
                  setValue={setTags}
                  setData={setTagsData}
                /> */}
              </div>
            </div>

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
          <>Loading</>
        )}
      </div>
      <div>
        <div className="flex flex-row justify-stretch">
          <div
            className={`sticky min-w-[50vw] max-w-[50vw] grow ${
              isOpen ? "fixed top-0" : "hidden"
            }`}
          >
            {selectedSnippet && snippetsData ? (
              <div className="">
                <VideoPlayer key={selectedSnippet} videoUrl={selectedSnippet} />
                <div className="pt-2">
                  <h3 className="text-left font-sans text-xl font-bold">
                    {snippetData[0]?.description}
                  </h3>
                  {/* <Button variant="outline" className="bg-red-500" onClick={handleDelete}>DELETE</Button> */}

                  <Button onClick={handleHideClick}>Hide</Button>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="grow">
            <ScrollArea className="flex h-[80.7vh] w-[full] flex-col overflow-hidden pr-5">
              {snippetsData &&
                tagsData &&
                snippetsData.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    tagsData={tagsData}
                    snippetData={snippet}
                    onClick={() => handleSnippetCardClick(snippet.video_url)}
                  />
                ))}

              {/* {areSnippetsDataLoading && areTagsDataLoading ? (
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
              )} */}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
