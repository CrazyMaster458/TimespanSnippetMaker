/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/axios";
import { MultiSelect } from "@/components/MultiSelect";
import { TimespanInput } from "@/components/TimespanInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSnippetsDataStore } from "../utils/StateStore";
import { Snippet, Tag, TimeProp } from "@/types/type";
import { parseTime } from "@/utils/timeUtils";

const DEFAULT_DESCRIPTION = "New Snippet";
const DEFAULT_TIME = "00:00:00";

type SnippetCardProps =  {
    snippetData: Snippet,
    tagsData: Tag[],
    onClick: React.MouseEventHandler<HTMLDivElement>;
    setSnippetTimes: () => void;
}

export const SnippetCard : React.FC<SnippetCardProps> = ({snippetData, tagsData, onClick, setSnippetTimes}) => {
    const [snippetStart, setSnippetStart] = useState<TimeProp>();
    const [snippetEnd, setSnippetEnd] = useState<TimeProp>();

    const [tags, setTags] = useState([]);
    
    const [snippetDuration, setSnippetDuration] = useState("0:00");
    const [description, setDescription] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const { updateSnippet } = useSnippetsDataStore((state) => ({
        updateSnippet: state.updateSnippet,
    }));

    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setDescription(e.target.value);
    }

    const handleCardClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          onClick(event);
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
            updateSnippet(response.data);
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
        if(snippetData && !initialLoad){
            setSnippetTimes({
                snippetStart: Object.values(snippetStart).join(":"),
                snippetEnd: Object.values(snippetEnd).join(":"),
              });    
        }
    }, [snippetStart, snippetEnd])

    // useEffect(() => {
    //     if(snippetData && !initialLoad){
    //         const tagsWithId = tags.map(tag => ({ tag_id: tag }));

    //         const updatedSnippetDate = {
    //             id: snippetData.id,
    //             description: description,
    //             starts_at: Object.values(snippetStart).join(":"),
    //             ends_at: Object.values(snippetEnd).join(":"),
    //             transcript: snippetData.transcript,
    //             video_type: snippetData.video_type,
    //             video_url: snippetData.video_url,
    //             video_id: snippetData.video_id,
    //             snippet_tags: tagsWithId,
    //         }
    //         onUpdate(updatedSnippetDate);
    //     }
    // }, [tags, description, snippetStart, snippetEnd])

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
          setDescription(snippetData.description || DEFAULT_DESCRIPTION);
          setSnippetStart(parseTime(snippetData.starts_at || DEFAULT_TIME));
          setSnippetEnd(parseTime(snippetData.ends_at || DEFAULT_TIME));    
          const mappedTags = snippetData.snippet_tags.map((tag) => tag.tag_id);
          setTags(mappedTags);
          setInitialLoad(false);
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
                            {snippetStart && snippetEnd ? <>
                                <TimespanInput snippetTime={snippetStart} setSnippetTime={setSnippetStart}/>
                            <div className="place-self-center">-</div>
                            <TimespanInput snippetTime={snippetEnd} setSnippetTime={setSnippetEnd}/>
                            </>
                            : <p>Loading...</p>}
                            
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
                        <MultiSelect data={tagsData} endpoint="tag" value={tags} setValue={setTags}/>
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