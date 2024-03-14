import { Search } from "lucide-react";

export const SearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  return (
    <>
      <div className="">
        <label className="input input-bordered flex input-md items-center gap-2">
          <input
            type="search"
            className="grow"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-[1.2rem]" />
        </label>
      </div>
    </>
  );
};
