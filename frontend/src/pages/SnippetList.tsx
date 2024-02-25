import { useEffect, useState } from "react";
import axiosClient from "@/axios";
import { SnippetCard } from "@/components/SnippetCard";
import { SelectComponent2 } from "@/components/MultiSelect copy";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@material-tailwind/react/components/Button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SearchBar } from "@/components/SearchBar";
import { Accordion2 } from "./AccorditionTest";

export default function SnippetList() {
    const [loading, setLoading] = useState(true);
    const [snippetData, setSnippetData] = useState([]);
    const [filteredSnippets, setFilteredSnippets] = useState<JSX.Element[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [openSnippetId, setOpenSnippetId] = useState<string | null>(null);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [tagsData, setTagsData] = useState(null);


    const handleSnippetCardClick = (videoUrl) => {
        setIsOpen(true);
        setSelectedSnippet(videoUrl);
      };

    const handleHideClick = () => {
      setIsOpen(false);
    };

    const handleSearch = (searchTerm: string) => {
      // If the search term is empty, show all snippets
      if (searchTerm.trim() === "") {
        setFilteredSnippets(
          snippetData.map((snippet) => (
            <SnippetCard key={snippet.id} snippetData={snippet} snippetId={snippet.id} onClick={() => handleSnippetCardClick(snippet.video_url)} />
          ))
        );
      } else {
        // Otherwise, filter snippets based on the search term
        const filtered = snippetData.filter((snippet) =>
          snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        setFilteredSnippets(
          filtered.map((snippet) => (
            <SnippetCard key={snippet.id} snippetData={snippet} snippetId={snippet.id} onClick={() => handleSnippetCardClick(snippet.video_url)} />
          ))
        );
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axiosClient.get('/snippet-list');
          console.log(response.data);
          setSnippetData(response.data.snippets);
          setTagsData(response.data.tags);
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      };
    
      fetchData();  // Call the async function
    }, []);


    useEffect(() => {
      console.log(selectedSnippet);
    }, [selectedSnippet]);

    useEffect(() => {
        if (snippetData && tagsData) {
            setFilteredSnippets(
            snippetData.map((snippet) => <SnippetCard key={snippet.id} snippetData={snippet} snippetId={snippet.id} tagData={tagsData} onClick={() => handleSnippetCardClick(snippet.video_url)}/>)
          );
        }
      }, [snippetData, tagsData]);

    return (
        <div>
            <div className="flex flex-row justify-stretch">
            <div className={`max-w-[50vw] min-w-[50vw] grow sticky ${isOpen ? "fixed top-0" : "hidden"}`}>
                {selectedSnippet ?
                  <div className="">
                    <VideoPlayer key={selectedSnippet} videoUrl={selectedSnippet}/>
                    <div className="pt-2">
                      <h3 className="font-bold font-sans text-left text-xl">{snippetData[0]?.description}</h3>
                      {/* <Button variant="outline" className="bg-red-500" onClick={handleDelete}>DELETE</Button> */}

                      <Button onClick={handleHideClick}>Hide</Button>
                    </div>

                  </div>
                  : <p>Loading...</p>
                } 
              </div>

              <div className="grow ">
                {/* <ScrollArea className="h-[88.5vh] w-[full] flex flex-col overflow-scroll"> */}
                <div className="flex flex-row justify-between pb-8 content-center items-center place-content-center place-items-center">
                  <div></div>

                  <div>
                    <SearchBar onSearch={handleSearch}/>
                  </div>
                </div>

         

                  <div className="flex flex-col w-full">
                      {/* {videos.length > 0 ? videos : <p>Loading...</p>} */}
                      {/* {filteredSnippets.length > 0 ? filteredSnippets : <p>Loading...</p>} */}
                  </div>
                    {/* <Button variant="outline" onClick={createSnippet}>Create Snippet</Button> */}
                {/* </ScrollArea> */}

                <Accordion2/>
                <Accordion2/>
                <Accordion2/>
                <Accordion2/>
                <Accordion2/>
                <Accordion2/>

              </div>

            </div>
        

          {/* <div className="flex flex-row justify-between pb-8 content-center items-center place-content-center place-items-center">

            <div>
            <div className="flex flex-row justify-between pb-8 content-center items-center place-content-center place-items-center">
                <div>
                    <SelectComponent2 data={videoTypes} onSelect={handleVideoSelect} multi={false} />
                </div>
                <div><SearchBar onSearch={handleSearch}/></div>
                <div className="flex flex-row gap-3">
                    <button><Image /></button>
                    <button><LayoutList /></button>
                    <button><LayoutGrid /></button>
                </div>
                <div className="flex flex-col w-full">
                    {videos.length > 0 ? videos : <p>Loading...</p>}
                    {filteredSnippets.length > 0 ? filteredSnippets : <p>Loading...</p>}
                 </div>
            </div>
          </div>
          </div> */}
          
        </div>
    );
}