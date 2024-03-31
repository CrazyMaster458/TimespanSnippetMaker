import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancedSearchDialog } from "./AdvancedSearchDialog";

export const SearchBar = () => {
  const [searchedQuery, setSearchedQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchedQuery) {
      navigate(`/videos?q=${searchedQuery.toLocaleLowerCase().trim()}`);
    }
  };

  return (
    <>
      <form className="mx-auto w-full" noValidate onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="search"
            autoComplete="off"
            id="default-search"
            className="block w-full rounded-full border border-input bg-background p-[0.62rem] ps-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 "
            placeholder="Search"
            value={searchedQuery}
            onChange={(e) => setSearchedQuery(e.target.value)}
            required
          />
          <AdvancedSearchDialog />
        </div>
      </form>
    </>
  );
};
