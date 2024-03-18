/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@material-tailwind/react/components/Button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SearchBar } from "@/components/SearchBar";
import { SnippetCard } from "../../components/SnippetCard";
// import { MultiSelect } from "@/components/MultiSelectOld";
import { useFetch } from "@/utils/useFetch";
import { Snippet, Tag } from "@/lib/types";

type FetchProps = {
  snippets: Snippet[];
  tags: Tag[];
};

export default function SnippetList() {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const [tags, setTags] = useState<number[]>([]);

  const [snippetData, setSnippetData] = useState<Snippet[] | null>(null);
  const [tagsData, setTagsData] = useState<Tag[] | null>(null);

  const handleSnippetCardClick = (videoUrl: string) => {
    setIsOpen(true);
    setSelectedSnippet(videoUrl);
  };

  const handleHideClick = () => {
    setIsOpen(false);
  };

  const { data, isPending, error } = useFetch<FetchProps>("/snippet-list");

  useEffect(() => {
    if (data && !isPending) {
      setSnippetData(data.snippets);
      setTagsData(data.tags);
    }
  }, [data]);

  const updateSnippet = (updatedSnippet) => {};

  const filteredSnippets = useMemo(() => {
    if (!snippetData) return [];

    let filtered = [...snippetData];

    if (searchedTerm) {
      filtered = filtered.filter((snippet) =>
        snippet.description.toLowerCase().includes(searchedTerm.toLowerCase()),
      );
    }

    if (tags.length > 0) {
      filtered = filtered.filter((snippet) =>
        snippet.snippet_tags.some((snippetTag) =>
          tags.includes(snippetTag.tag_id),
        ),
      );
    }

    return filtered.map((snippet) => (
      <SnippetCard
        key={snippet.id}
        tagsData={tagsData}
        setTagsData={setTagsData}
        snippetData={snippet}
        onUpdate={updateSnippet}
        onClick={() => handleSnippetCardClick(snippet.video_url)}
      />
    ));
  }, [snippetData, tagsData, tags, searchedTerm]);

  return (
    <div>
      <div className="flex flex-row place-content-center place-items-center content-center items-center justify-between">
        {tagsData && snippetData ? (
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

            <div className="w-[30rem]">
              <SearchBar search={searchedTerm} setSearch={setSearchedTerm} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div>
        <div className="flex flex-row justify-stretch">
          <div
            className={`sticky min-w-[50vw] max-w-[50vw] grow ${
              isOpen ? "fixed top-0" : "hidden"
            }`}
          >
            {selectedSnippet && snippetData ? (
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
              <div className="flex justify-between pb-3"></div>
              <div className="flex w-full flex-col">
                {filteredSnippets.length > 0 ? (
                  filteredSnippets
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
