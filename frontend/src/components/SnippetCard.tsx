/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import { KeyboardEvent, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { Button } from "@/components/ui/button";

type OptionType = { value: string; label: string };

const options: OptionType[] = [
  { value: "fox", label: "🦊 Fox" },
  { value: "Butterfly", label: "🦋 Butterfly" },
  { value: "Honeybee", label: "🐝 Honeybee" },
];

export const SnippetCard = () => {
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
  const [description, setDescription] = useState("");
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  const [isArrowKey, setIsArrowKey] = useState(false);
  const [hook, setHook] = useState("");

  // SnippetStart Reffs
  const inputRefHoursStart = useRef<HTMLInputElement>(null);
  const inputRefMinutesStart = useRef<HTMLInputElement>(null);
  const inputRefSecondsStart = useRef<HTMLInputElement>(null);
  // SnippetEnd Reffs
  const inputRefHoursEnd = useRef<HTMLInputElement>(null);
  const inputRefMinutesEnd = useRef<HTMLInputElement>(null);
  const inputRefSecondsEnd = useRef<HTMLInputElement>(null);
  const inputRefDescription = useRef<HTMLInputElement>(null);

  const handleInputChangeStart: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { name, value } = e.currentTarget;

    if (name in snippetStart) {
      if (!isArrowKey) {
        if (value.length > 1) {
          if (name === "hours") {
            if (e.currentTarget === inputRefHoursStart.current) {
              inputRefMinutesStart.current?.focus();
            }
          } else if (name === "minutes") {
            if (e.currentTarget === inputRefMinutesStart.current) {
              inputRefSecondsStart.current?.focus();
            }
          } else if (name === "seconds") {
            if (e.currentTarget === inputRefSecondsStart.current) {
              inputRefHoursEnd.current?.focus();
            }
          }
        }
      }

      const snippetStartCheck = { ...snippetStart, [name]: value };

      const startSeconds = timeToSeconds(snippetStartCheck);
      const endSeconds = timeToSeconds(snippetEnd);

      setSnippetStart({
        ...snippetStart,
        [name]: leadingZeroFormatter.format(
          Number(value) < 60 ? Number(value) : 59
        ),
      });

      if (startSeconds > endSeconds) {
        setSnippetEnd({
          ...snippetStart,
          [name]: leadingZeroFormatter.format(
            Number(value) < 60 ? Number(value) : 59
          ),
        });
      }

      changeDuration();
    }
  };

  const handleInputChangeEnd = (e: {
    target: { name: any; value: any };
    currentTarget: HTMLInputElement | null;
  }) => {
    const { name, value } = e.target;

    if (name in snippetEnd) {
      if (!isArrowKey) {
        if (value.length > 1) {
          if (name === "hours") {
            if (e.currentTarget === inputRefHoursEnd.current) {
              inputRefMinutesEnd.current?.focus();
            }
          } else if (name === "minutes") {
            if (e.currentTarget === inputRefMinutesEnd.current) {
              inputRefSecondsEnd.current?.focus();
            }
          } else if (name === "seconds") {
            if (e.currentTarget === inputRefSecondsEnd.current) {
              inputRefDescription.current?.focus();
            }
          }
        }
      }

      setSnippetEnd({
        ...snippetEnd,
        [name]: leadingZeroFormatter.format(
          Number(value) < 60 ? Number(value) : 59
        ),
      });

      changeDuration();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      setIsArrowKey(true);
    } else {
      setIsArrowKey(false);
    }
  };

  // function handleDescriptionChange(event: { target: { value: string } }) {
  //   const { value } = event.target;
  //   setDescription(value);
  // }

  function changeDuration() {
    const startHours = parseInt(inputRefHoursStart.current?.value || "0", 10);
    const startMinutes = parseInt(
      inputRefMinutesStart.current?.value || "0",
      10
    );
    const startSeconds = parseInt(
      inputRefSecondsStart.current?.value || "0",
      10
    );

    const endHours = parseInt(inputRefHoursEnd.current?.value || "0", 10);
    const endMinutes = parseInt(inputRefMinutesEnd.current?.value || "0", 10);
    const endSeconds = parseInt(inputRefSecondsEnd.current?.value || "0", 10);

    let minutes = endMinutes - startMinutes;
    let seconds = endSeconds - startSeconds;

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }

    let hours = endHours - startHours;

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

  const timeToSeconds = (time: {
    hours: string;
    minutes: string;
    seconds: string;
  }): number => {
    const { hours, minutes, seconds } = time;
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  function handleDescriptionChange(event: { target: { value: any } }) {
    const { value } = event.target;

    // Split the description by "//" and take the first part
    if (value.includes("//")) {
      const limitedDescription = value.split("//")[0].trim();
      setHook(limitedDescription);
    } else {
      if (value.length < 80) {
        setHook(value);
      }
    }
    setDescription(value);
  }

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOverflow, setIsOverflow] = useState("hidden");

  function OverflowVisibile() {
    setIsOverflow("visible");
  }

  function OverflowHidden() {
    setIsOverflow("hidden");
  }

  const handleChange = () => {
    console.log(selectedOptions);
    const options2 = { ...selectedOptions };
    console.log(options2);
  };

  return (
    <Card className="mb-2 drop-shadow-md">
      <div className="place-self-center px-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" style={{ overflow: isOverflow }}>
            <AccordionTrigger className="flex justify-between p-3">
              <div className="">{hook ? hook : "New Snippet"}</div>
              <div className="flex items-center">
                <div className="">{snippetDuration}</div>
                <ChevronDown className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="mt-[-8px] px-3">
              <Separator className="mt-2" />
              <div className="pt-3 flex flex-row gap-4">
                <div className="flex flex-row gap-1">
                  <div className="timespaninput flex group items-center h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
                    <input
                      type="number"
                      name="hours"
                      value={snippetStart.hours}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      max={99}
                      min={0}
                      style={{
                        width: "20px",
                        textAlign: "center",
                      }}
                      ref={inputRefHoursStart}
                      onClick={() => inputRefHoursStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="minutes"
                      value={snippetStart.minutes}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      max={59}
                      min={0}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefMinutesStart} // Add this ref
                      onClick={() => inputRefMinutesStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="seconds"
                      value={snippetStart.seconds}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      max={59}
                      min={0}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefSecondsStart} // Add this ref
                      onClick={() => inputRefSecondsStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                  </div>
                  <div className="place-self-center">-</div>
                  <div className="timespaninput flex group items-center h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
                    <input
                      type="number"
                      name="hours"
                      value={snippetEnd.hours}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      style={{
                        width: "20px",
                        textAlign: "center",
                      }}
                      max={99}
                      min={0}
                      ref={inputRefHoursEnd}
                      onClick={() => inputRefHoursEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="minutes"
                      value={snippetEnd.minutes}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      max={59}
                      min={0}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefMinutesEnd}
                      onClick={() => inputRefMinutesEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="seconds"
                      value={snippetEnd.seconds}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      max={59}
                      min={0}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefSecondsEnd}
                      onClick={() => inputRefSecondsEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                  </div>
                </div>
                <div className="w-full focus-within:h-auto">
                  <Input
                    type="text"
                    className="w-full"
                    value={description}
                    ref={inputRefDescription}
                    maxLength={255}
                    onChange={handleDescriptionChange}
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="w-full pt-3" onClick={OverflowVisibile}>
                <CreatableSelect
                  isMulti
                  options={options}
                  value={selectedOptions}
                  onChange={(e) => setSelectedOptions(e)}
                  isClearable={true}
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={"Hellow"}
                  isDisabled={false}
                  isLoading={false}
                  isRtl={false}
                  isSearchable={true}
                  name="hashtags"
                  onBlur={OverflowHidden}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Set a high z-index value
                    }),
                  }}
                />
              </div>
              {/* <button onClick={handleChange}>Show items</button> */}
              <div className="w-full pt-5 flex justify-start place-items-center gap-3">
                <Button className="px-5" variant="default">
                  Save
                </Button>
                <Button variant="outline">
                  <Download className="pr-2" /> Download
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};
