import { useEffect, useState } from "react";
import { Search } from 'lucide-react';
import axios from "axios";


export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
      // Implement your search logic here
      console.log("Searching for:", searchTerm);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("/search", {
                params: { searchTerm },
            });
    
            const data = response.data;
            setSearchResults(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        if (searchTerm.trim() !== "") {
            fetchData();
          } else {
            // Handle case when the search term is empty (e.g., clear the results)
            setSearchResults([]);
          }
    }, [searchTerm])

  return (
    <>
        <div className="relative mt-1 w-[30rem]">
            <input 
                type="search" 
                id="password" 
                className="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            >
            </input>
            <button 
                className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"
                onClick={handleSearch}
            ><Search /></button>
        </div>

        {/* Display search results */}
        {searchResults.map((result) => (
            <div key={result.id}>{/* Render your search result item here */}</div>
        ))}
    </>
  )
}