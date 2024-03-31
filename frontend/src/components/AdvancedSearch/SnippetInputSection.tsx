import { useGetQuery } from "@/services/queries";
import { useNavigate } from "react-router-dom";
import { useAdvancedSearchContent } from "../contexts/AdvancedSearchContext";
import { useState } from "react";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SimpleSelect } from "../SimpleSelect";
import { Textarea } from "../ui/textarea";

export const SnippetInputSection = () => {
  const navigate = useNavigate();

  const { contentType, selectedContentType, setOpen } =
    useAdvancedSearchContent();

  const { data: tagsData, isLoading: areTagsDataLoading } = useGetQuery("tags");

  const [searchedDescription, setSearchedDescription] = useState("");
  const [searchedTranscript, setSearchedTranscript] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const isTranscript = searchedTranscript ? `&s=${searchedTranscript}` : "";
    const areTags =
      selectedTags.length > 0 ? `&t=${selectedTags.join(",")}` : "";

    navigate(
      `/${contentType[selectedContentType - 1]?.value}?q=${searchedDescription}${areTags}${isTranscript}`,
    );
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <div>
          <Label>Description</Label>
          <Input
            value={searchedDescription}
            onChange={(e) => setSearchedDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        {!areTagsDataLoading && (
          <div>
            <Label>Tags</Label>
            <SimpleSelect
              data={tagsData}
              selectedOptions={selectedTags}
              setSelectedOptions={setSelectedTags}
              placeholder="Select tags"
              isCleanable={true}
              isMulti={true}
            />
          </div>
        )}
        <div>
          <Label>Transcript</Label>
          <Textarea
            value={searchedTranscript}
            onChange={(e) => setSearchedTranscript(e.target.value)}
            placeholder="Transcript"
            className="max-h-56"
          />
        </div>
      </section>
      <DialogFooter className="pt-4">
        <Button type="submit">Search</Button>
      </DialogFooter>
    </form>
  );
};
