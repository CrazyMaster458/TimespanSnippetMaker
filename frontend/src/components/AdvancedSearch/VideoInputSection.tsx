import { useState } from "react";
import { SimpleSelect } from "../SimpleSelect";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useGetQuery } from "@/services/queries";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useAdvancedSearchContent } from "../contexts/AdvancedSearchContext";
import { useNavigate } from "react-router-dom";

export const VideoInputSection = () => {
  const [selectedVideoType, setSelectedVideoType] = useState<number[]>([]);
  const [selectedHost, setSelectedHost] = useState<number[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
  const [searchedTitle, setSearchedTitle] = useState("");

  const navigate = useNavigate();

  const { contentType, selectedAccessibility, selectedContentType, setOpen } =
    useAdvancedSearchContent();

  const { data: videoTypesData, isLoading: areVideoTypesDataLoading } =
    useGetQuery("video_types");
  const { data: influencersData, isLoading: areInfluencersDataLoading } =
    useGetQuery("influencers");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const isPublic = selectedAccessibility === 2 ? "public/" : "";
    const isVideoType =
      selectedVideoType.length > 0 ? `&vt=${selectedVideoType}` : "";
    const isHost = selectedHost.length > 0 ? `&h=${selectedHost}` : "";
    const areGuests =
      selectedGuests.length > 0 ? `&g=${selectedGuests.join(",")}` : "";

    navigate(
      `/${isPublic}${contentType[selectedContentType - 1]?.value}?q=${searchedTitle}${isVideoType}${isHost}${areGuests}`,
    );
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <div>
          <Label>Title</Label>
          <Input
            value={searchedTitle}
            onChange={(e) => setSearchedTitle(e.target.value)}
            placeholder="Title"
          />
        </div>
        {!areVideoTypesDataLoading && (
          <div>
            <Label>Video type</Label>
            <SimpleSelect
              data={videoTypesData}
              selectedOptions={selectedVideoType}
              setSelectedOptions={setSelectedVideoType}
              placeholder="Select video type"
              isCleanable={true}
            />
          </div>
        )}
        <section className="flex flex-row justify-stretch gap-5">
          {!areInfluencersDataLoading && (
            <>
              <div className="w-full">
                <Label>Host</Label>
                <SimpleSelect
                  data={influencersData}
                  selectedOptions={selectedHost}
                  setSelectedOptions={setSelectedHost}
                  placeholder="Select content type"
                  isCleanable={true}
                />
              </div>
              <div className="w-full">
                <Label>Guests</Label>
                <SimpleSelect
                  data={influencersData}
                  selectedOptions={selectedGuests}
                  setSelectedOptions={setSelectedGuests}
                  placeholder="Select content type"
                  isCleanable={true}
                  isMulti={true}
                />
              </div>
            </>
          )}
        </section>
      </section>
      <DialogFooter className="pt-4">
        <Button type="submit">Search</Button>
      </DialogFooter>
    </form>
  );
};
