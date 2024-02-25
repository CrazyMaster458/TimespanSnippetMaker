/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectComponent } from "@/components/MultiSelect";
import { TimespanInput } from "@/components/TimespanInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export const Accordion2 = () => {
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

    
    const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setDescription(e.target.value);
    }

    const handleTagSelect = (value: any) => {
        setTags(value.length > 0 ? value[0] : null);
    };

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

    return (
        <div>
            <div className="collapse collapse-arrow">
                <input type="radio" name="my-accordion-2"/> 
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
                        <SelectComponent data={[]} onSelect={handleTagSelect} endpoint="tag" multi={true}/>
                    </div>
                    
                    {/* <div className="pt-3">
                        <Textarea value={null} placeholder="Transcript not avalible" />
                    </div> */}
                </div>
            </div>
        </div>
    );
}