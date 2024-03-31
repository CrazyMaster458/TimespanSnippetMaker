import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdvancedSearchContent } from "../contexts/AdvancedSearchContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export const InfluencerInputSection = () => {
  const [searchedName, setSearchedName] = useState("");

  const navigate = useNavigate();

  const { contentType, selectedContentType, setOpen } =
    useAdvancedSearchContent();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    navigate(
      `/${contentType[selectedContentType - 1]?.value}?q=${searchedName}`,
    );
    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <div>
          <Label>Name</Label>
          <Input
            value={searchedName}
            onChange={(e) => setSearchedName(e.target.value)}
            placeholder="Name"
          />
        </div>
      </section>
      <DialogFooter className="pt-4">
        <Button type="submit">Search</Button>
      </DialogFooter>
    </form>
  );
};
