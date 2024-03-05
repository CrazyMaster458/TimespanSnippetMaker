/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/axios";
import { SelectComponent } from "@/components/MultiSelect";
import { SelectComponent2 } from "@/components/MultiSelect copy 2";
import { TimespanInput } from "@/components/TimespanInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SnippetCardProps  {
    snippetData: {
        id: string;
        description: string;
        starts_at: string;
        ends_at: string;
        transcript: string;
        video_type: Array<object>;
        video_url: string;
        video_id: number;
        snippet_tags: [{tag_id: number}];
    },
    tagsData: [
        {
            id: string;
            name: string;
        }
    ],
    setTagsData: (tagsData: Array<{ id: string; name: string }>) => void,
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const SnippetCard : React.FC<SnippetCardProps> = ({snippetData, tagsData, setTagsData, onClick}) => {
    const [snippetStart, setSnippetStart] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const [snippetEnd, setSnippetEnd] = useState({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    
    const [snippetDuration, setSnippetDuration] = useState("0:00");
    const [description, setDescription] = useState("New Snippet");
    const [tags, setTags] = useState<any[]>([]);
    const [initialLoad, setInitialLoad] = useState(true);

    
    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setDescription(e.target.value);
    }

    const handleTagSelect = (value: any) => {
        setTags(Array.isArray(value) ? value.map(tag => parseInt(tag, 10)) : []);
    };

    const parseTime = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(':');
        
        return {
          hours: hours.padStart(2, '0'),
          minutes: minutes.padStart(2, '0'),
          seconds: seconds.padStart(2, '0'),
        };
    };

    const handleCardClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          onClick(event);
          // Additional logic specific to SnippetCard if needed
        },
        [onClick]
    );

    const updateData = async () => {
        try {
            const response = await axiosClient.put(`/snippet/${snippetData.id}`, {
                description: description,
                starts_at: Object.values(snippetStart).join(":"),
                ends_at: Object.values(snippetEnd).join(":"),
                video_type_id: 1,
                video_id: snippetData.video_id,
                snippet_tags: tags,
            });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    // const deleteSnippet = async () => {
    //     try {
    //         const response = await axiosClient.delete(`/snippet/${snippetData.id}`);
    //         console.log(response.data.data);
    //         onDeleteSnippet(snippetData.id);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    
    const cutVideo = async () => {
        try {
            const response = await axiosClient.post(`/cut/${snippetData.id}`);
            console.log(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (tags) {
            console.log(tags);
        }
    }, [tags])

    useEffect(() => {
        if(snippetEnd && snippetStart){
           const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
            minimumIntegerDigits: 2,
            });

          let minutes = parseInt(snippetEnd.minutes) - parseInt(snippetStart.minutes);
          let seconds = parseInt(snippetEnd.seconds) - parseInt(snippetStart.seconds);
      
          if (seconds < 0) {
            seconds += 60;
            minutes--;
          }
      
          let hours = parseInt(snippetEnd.hours) - parseInt(snippetStart.hours);
      
          if (minutes < 0) {
            minutes += 60;
            hours--;
          }
      
          if (hours < 0) {
            minutes = 0;
            seconds = 0;
          }
      
          setSnippetDuration(`${minutes}:${leadingZeroFormatter.format(seconds)}`);
        }
    }, [snippetEnd, snippetStart])

    useEffect(() => {
        if (snippetData && initialLoad) {
          setDescription(snippetData.description || "New Snippet // <-- to split the hook from description");
          setSnippetStart(parseTime(snippetData.starts_at || "00:00:00"));
          setSnippetEnd(parseTime(snippetData.ends_at || "00:00:00"));    
          setInitialLoad(false);
          const mappedTags = snippetData.snippet_tags.map((tag) => tag.tag_id);
          setTags(mappedTags);        
        }
      }, [initialLoad, snippetData, snippetEnd, snippetStart]);

    return (
        <div>
            <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2" onClick={handleCardClick}/> 
                <div className="collapse-title">
                    <div className="flex justify-between">
                        <div>{description}</div>
                        <div className="flex items-center">
                            <div>{snippetDuration}</div>
                        </div>
                    </div>
                </div>
                <div className="collapse-content"> 
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-row gap-1">
                            <TimespanInput snippetTime={snippetStart} setSnippetTime={setSnippetStart}/>
                            <div className="place-self-center">-</div>
                            <TimespanInput snippetTime={snippetEnd} setSnippetTime={setSnippetEnd}/>
                        </div>
                        <div className="w-full focus-within:h-auto">
                            <Input
                                type="text"
                                className="w-full"
                                value={description}
                                maxLength={255}
                                onChange={handleDescriptionChange}
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    <div className="pt-3">
                        {/* <SelectComponent data={tagsData} endpoint="tag" multi={true} value={tags} setValue={setTags}/> */}
                        <SelectComponent2 data={tagsData} endpoint="tag" value={tags} setValue={setTags} setTagsData={setTagsData}/>
                    </div>
                    
                    <div className="pt-3">
                        <Textarea value={snippetData.transcript} placeholder="Transcript not avalible" />
                    </div>

                    <div className="w-full pt-5 flex justify-between place-items-center">
                        <div className="flex justify-start gap-3">
                            <Button className="px-5" onClick={updateData} variant="default">
                                Save
                            </Button>
                            <Button variant="outline" onClick={cutVideo}>
                                <Download className="pr-2"/> Download
                            </Button>
                        </div>
                        <Button variant="outline" className="bg-red-500 justify-self-end">
                            DELETE
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}