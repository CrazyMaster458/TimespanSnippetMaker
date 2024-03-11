import { useEffect, useState } from "react";
import axiosClient from "@/axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@material-tailwind/react/components/Button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SearchBar } from "@/components/SearchBar";
import { SnippetCard } from "../../components/SnippetCardOld";
import { MultiSelect } from "@/components/MultiSelectOld";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";


export default function SnippetList() {
    const [loading, setLoading] = useState(true);
    const [snippetData, setSnippetData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSnippets, setFilteredSnippets] = useState<JSX.Element[]>([]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedSnippet, setSelectedSnippet] = useState("");
    const [tagsData, setTagsData] = useState(null);
    const [tags, setTags] = useState([]);


    const handleSnippetCardClick = (videoUrl: string) => {
      setIsOpen(true);
      setSelectedSnippet(videoUrl);
    };

    const handleHideClick = () => {
      setIsOpen(false);
    };

    const handleSearch = (searchTerm) => {
      setSearchTerm(searchTerm);
    };

    // useEffect(() => {
    //   console.log(snippetData);
    //   console.log(filteredSnippets);
    // },[snippetData, filteredSnippets]);

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
    
      fetchData();
    }, []);

    useEffect(() => {
      filterSnippets();
    }, [snippetData, tagsData, tags, searchTerm]);
    
    const filterSnippets = () => {
      const filteredByTags = snippetData.filter((snippet) =>
        tags.every((tag) =>
          snippet.snippet_tags.some((snippetTag) => snippetTag.tag_id === tag)
        )
      );

      console.log(snippetData);
      console.log(filteredByTags);
    
      const filteredBySearchTerm = filteredByTags.filter((snippet) =>
        snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const snippetElements = filteredBySearchTerm.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          tagsData={tagsData}
          setTagsData={setTagsData}
          snippetData={snippet}
          onUpdate={updateSnippet}
          onClick={() => handleSnippetCardClick(snippet.video_url)}
        />
      ));
    
      console.log(snippetData);
      setFilteredSnippets(snippetElements);
    };

    const updateSnippet = (updatedSnippet) => {
      console.log(updatedSnippet)

      setSnippetData((currentSnippets) => 
        currentSnippets.map((snippet) => 
          snippet.id === updatedSnippet.id ? updatedSnippet : snippet
        )
      );
      // filterSnippets();
    };
  
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
                <div className="flex flex-row justify-between content-center items-center place-content-center place-items-center">
                  <div></div>
                </div>

                <ScrollArea className="h-[88.5vh] w-[full] flex flex-col overflow-hidden pr-5">
                  
                  <div className="flex pb-3 justify-between">
                  {/* <Popover>
                    <PopoverTrigger>
                      <Badge variant="outline">Badge</Badge>
                    </PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                  </Popover> */}
                    <div className="w-[30%]">
                      {tagsData ? <MultiSelect data={tagsData} endpoint="tags" value={tags} setValue={setTags} setData={setTagsData}/>: <p>Loading...</p>}
                    </div>
                    <div className="w-[50%]">
                      <SearchBar onSearch={handleSearch} />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                      {filteredSnippets.length > 0 ? filteredSnippets : <p>Loading...</p>}
                  </div>
                </ScrollArea>


                    {/* <Button variant="outline" onClick={createSnippet}>Create Snippet</Button> */}
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