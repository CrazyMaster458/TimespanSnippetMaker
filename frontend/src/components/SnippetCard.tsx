import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Separator } from "./ui/separator";
import React, { useState } from "react";
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
  const [snippetStart, setSnippetStart] = useState("00:00:00");
  const [snippetEnd, setSnippetEnd] = useState("00:00:00");
  const [snippetDuration, setSnippetDuration] = useState("0:00");
  const [description, setDescription] = useState("");

  function handleTimeChangeStart(event: { target: { value: string } }) {
    const { value } = event.target;
    setSnippetStart(value);
    changeDuration();
  }
  function handleTimeChangeEnd(event: { target: { value: string } }) {
    const { value } = event.target;
    setSnippetEnd(value);
    changeDuration();
  }
  function handleDescriptionChange(event: { target: { value: string } }) {
    const { value } = event.target;
    setDescription(value);
  }

  function changeDuration() {
    console.log(snippetStart);
    console.log(snippetEnd);
    const startSeconds = timeToSeconds(snippetStart);
    const endSeconds = timeToSeconds(snippetEnd);
    console.log(startSeconds);
    console.log(endSeconds);

    const durationSeconds = endSeconds - startSeconds;
    console.log(durationSeconds);
    console.log(secondsToTime(durationSeconds));
    setSnippetDuration(secondsToTime(durationSeconds));
  }

  function timeToSeconds(timeStr: string) {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Helper function to convert seconds to "HH:mm:ss"
  function secondsToTime(seconds: number) {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString()}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Time

  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const [second, setSecond] = useState("00");

  const handleHourChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (/^\d{0,2}$/.test(value) && parseInt(value) <= 23) {
      setHour(value.padStart(2, "0"));
    }
  };

  const handleMinuteChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (/^\d{0,2}$/.test(value) && parseInt(value) <= 59) {
      setMinute(value.padStart(2, "0"));
    }
  };

  const handleSecondChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    if (/^\d{0,2}$/.test(value) && parseInt(value) <= 59) {
      setSecond(value.padStart(2, "0"));
    }
  };

  const formattedTime = `${hour}:${minute}:${second}`;

  return (
    // <div className="w-[600px] m-16">
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
                  <Input
                    className="w-[85px]"
                    type="time"
                    name="appt-time"
                    step="2"
                    value={snippetStart}
                    onChange={handleTimeChangeStart}
                    placeholder="00:00:00"
                  />
                  <div className="place-self-center">-</div>
                  <Input
                    className="w-[85px]"
                    type="time"
                    name="appt-time"
                    step="2"
                    value={snippetEnd}
                    onChange={handleTimeChangeEnd}
                    placeholder="00:00:00"
                  />{" "}
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
              <div className="pt-3">
                <label htmlFor="dateInput"></label>
              </div>
              <input
                type="text"
                value={formattedTime}
                onChange={(e) => {
                  const { value } = e.target;
                  // Allow only numeric digits and colons
                  const cleanedValue = value.replace(/[^0-9:]/g, "");
                  // Update the state variables accordingly
                  const [hourPart, minutePart, secondPart] =
                    cleanedValue.split(":");
                  setHour(hourPart);
                  setMinute(minutePart);
                  setSecond(secondPart);
                }}
                onBlur={(e) => {
                  // Ensure the state variables are in the desired format (padded with zeros)
                  const formattedHour = hour.padStart(2, "0");
                  const formattedMinute = minute.padStart(2, "0");
                  const formattedSecond = second.padStart(2, "0");
                  // Update the state with the formatted time
                  setHour(formattedHour);
                  setMinute(formattedMinute);
                  setSecond(formattedSecond);
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
    // </div>
  );
};
