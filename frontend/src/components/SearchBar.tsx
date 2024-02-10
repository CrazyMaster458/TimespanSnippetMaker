import { useEffect, useState } from "react";
import { Search } from 'lucide-react';
import axios from "axios";
import axiosClient from "@/axios";


export const SearchBar = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
      // Implement your search logic here
      console.log("Searching for:", searchTerm);

      onSearch(searchTerm);

      // axiosClient
      // .get("/search", {
      //   params: {
      //     query: searchTerm
      //   }      
      // })
      // .then(({ data }) => {
      //   console.log(data);
      // })
      // .catch((error) => {

      //   console.log(error);
      // });
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const response = await axiosClient.get(`/search`, {
    //           params: { query: searchTerm },
    //         });
    //         setSearchResults(response.data);
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     };

    //     if (searchTerm.trim() !== "") {
    //         fetchData();
    //       } else {
    //         // Handle case when the search term is empty (e.g., clear the results)
    //         setSearchResults([]);
    //       }
    // }, [searchTerm])

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

  return (
    <>
        <div className="relative w-[30rem]">
            <input 
                type="search" 
                id="password" 
                className="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress} // Add this line
            >
            </input>
            <button 
                className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"
                onClick={handleSearch}
            ><Search /></button>
        </div>

        {/* Display search results */}
        {/* {searchResults.map((result) => (
            <div key={result.id}>{result.title}</div>
        ))} */}
    </>
  )
}