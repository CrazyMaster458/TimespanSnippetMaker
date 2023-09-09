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
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  selected: boolean;
}

interface MultiSelectTagProps {
  id: string;
  customs?: {
    shadow?: boolean;
    rounded?: boolean;
    placeholder?: string;
    onChange?: (selectedValues: Option[]) => void;
  };
}

export const SnippetCard = () => {
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  const [snippetStart, setSnippetStart] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // State for snippetEnd
  const [snippetEnd, setSnippetEnd] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // SnippetStart Reffs
  const inputRefHoursStart = useRef<HTMLInputElement>(null);
  const inputRefMinutesStart = useRef<HTMLInputElement>(null);
  const inputRefSecondsStart = useRef<HTMLInputElement>(null);
  // SnippetEnd Reffs
  const inputRefHoursEnd = useRef<HTMLInputElement>(null);
  const inputRefMinutesEnd = useRef<HTMLInputElement>(null);
  const inputRefSecondsEnd = useRef<HTMLInputElement>(null);

  const snippetStartRef = useRef(snippetStart);
  const snippetEndRef = useRef(snippetEnd);

  useEffect(() => {
    snippetStartRef.current = snippetStart;
    snippetEndRef.current = snippetEnd;
  }, [snippetStart, snippetEnd]);

  const handleInputChangeStart = (e: {
    target: { name: any; value: any };
    currentTarget: HTMLInputElement | null;
  }) => {
    const { name, value } = e.target;

    if (isValidTimeFormat(value) && name in snippetStart) {
      // Check if the entered value is a two-digit number
      if (value.length === 2) {
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
            setSnippetEnd({
              hours: snippetStart.hours,
              minutes: snippetStart.minutes,
              seconds: value,
            });
          }
        }
      }

      setSnippetStart({
        ...snippetStart,
        [name]: value,
      });
      changeDuration();
    }
  };

  const handleInputChangeEnd = (e: {
    target: { name: any; value: any };
    currentTarget: HTMLInputElement | null;
  }) => {
    const { name, value } = e.target;

    if (isValidTimeFormat(value) && name in snippetEnd) {
      // Check if the entered value is a two-digit number
      if (value.length === 2) {
        if (name === "hours") {
          if (e.currentTarget === inputRefHoursEnd.current) {
            inputRefMinutesEnd.current?.focus();
          }
        } else if (name === "minutes") {
          if (e.currentTarget === inputRefMinutesEnd.current) {
            inputRefSecondsEnd.current?.focus();
          }
        }
      }

      setSnippetEnd({
        ...snippetEnd,
        [name]: value,
      });
      changeDuration();
    }
  };

  const isValidTimeFormat = (value: string) => {
    const pattern = /^[0-5]?[0-9]$/;
    return pattern.test(value);
  };

  const [snippetDuration, setSnippetDuration] = useState("0:00");
  const [description, setDescription] = useState("");

  function handleDescriptionChange(event: { target: { value: string } }) {
    const { value } = event.target;
    setDescription(value);
  }

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
      // Reset the duration to 0 if the end time is before the start time
      minutes = 0;
      seconds = 0;
    }

    setSnippetDuration(`${minutes}:${leadingZeroFormatter.format(seconds)}`);
  }

  return (
    <Card className="p-3 mb-2">
      <div className="place-self-center px-2">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex justify-between">
              <div>{description ? description : "New Snippet"}</div>
              <div className="flex items-center">
                <div className="">{snippetDuration}</div>
                <ChevronDown className="ml-3 h-4 w-4 shrink-0 transition-transform duration-200" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Separator className="mt-2" />
              <div className="pt-3 flex flex-row gap-4">
                <div className="flex flex-row gap-1">
                  <div className="timespaninput flex group items-center h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
                    <input
                      type="text"
                      name="hours"
                      value={snippetStart.hours}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      style={{
                        width: "20px",
                        textAlign: "center",
                      }}
                      ref={inputRefHoursStart}
                      onClick={() => inputRefHoursStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="minutes"
                      value={snippetStart.minutes}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefMinutesStart} // Add this ref
                      onClick={() => inputRefMinutesStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="seconds"
                      value={snippetStart.seconds}
                      onChange={handleInputChangeStart}
                      maxLength={2}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefSecondsStart} // Add this ref
                      onClick={() => inputRefSecondsStart.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                  <div className="place-self-center">-</div>
                  <div className="timespaninput flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <input
                      type="text"
                      name="hours"
                      value={snippetEnd.hours}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      style={{
                        width: "20px",
                        textAlign: "center",
                      }}
                      ref={inputRefHoursEnd}
                      onClick={() => inputRefHoursEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="minutes"
                      value={snippetEnd.minutes}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefMinutesEnd}
                      onClick={() => inputRefMinutesEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                    <span>:</span>
                    <input
                      type="text"
                      name="seconds"
                      value={snippetEnd.seconds}
                      onChange={handleInputChangeEnd}
                      maxLength={2}
                      style={{ width: "20px", textAlign: "center" }}
                      ref={inputRefSecondsEnd}
                      onClick={() => inputRefSecondsEnd.current!.select()}
                      onFocus={(e) => e.target.select()}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <Input
                    className="w-full"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Description"
                  />
                </div>
              </div>
              {/* <div className="pt-3">
                  <select name="containers" id="" multiple>
                    <option value="1">Motivation</option>
                    <option value="2">Deep</option>
                    <option value="3">Positive</option>
                    <option value="4">NWO</option>
                    <option value="5">Scared</option>
                    <option value="6">Mean</option>
                    <option value="7">Angry</option>
                  </select>
                </div> */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};
