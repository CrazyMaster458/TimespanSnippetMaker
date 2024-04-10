import { TimeProp } from "@/lib/types";
import React, { useEffect, useRef, useState } from "react";

type TimespanInputProps = {
  snippetTime: TimeProp;
  setSnippetTime: (newTime: TimeProp) => void;
  readOnly?: boolean;
  maxDuration?: number;
};

const MAX_TIME_UNIT = 59;

export const TimespanInput: React.FC<TimespanInputProps> = ({
  snippetTime,
  setSnippetTime,
  readOnly = false,
  maxDuration,
}) => {
  const inputRefHours = useRef<HTMLInputElement>(null);
  const inputRefMinutes = useRef<HTMLInputElement>(null);
  const inputRefSeconds = useRef<HTMLInputElement>(null);

  const [isArrowKey, setIsArrowKey] = useState(false);

  const handleArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsArrowKey(e.key === "ArrowUp" || e.key === "ArrowDown");
  };

  const focusNextInput = (
    currentInputRef: React.RefObject<HTMLInputElement> | null,
  ) => {
    if (currentInputRef?.current) {
      currentInputRef.current.focus();
    }
  };

  const [maxHours, setMaxHours] = useState(0);
  const [maxMinutes, setMaxMinutes] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(0);

  useEffect(() => {
    if (maxDuration) {
      const hours = Math.floor(maxDuration / 3600);
      const minutes = Math.floor((maxDuration % 3600) / 60);
      const seconds = maxDuration % 60;
      setMaxHours(hours);
      setMaxMinutes(minutes);
      setMaxSeconds(seconds);
    }
  }, [maxDuration]);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });
    const { name, value } = e.currentTarget;
    const numericValue = Number(value);
    let maxValue = 50;

    if (name in snippetTime) {
      if (!isArrowKey && value.length > 1) {
        switch (name) {
          case "hours":
            if (inputRefHours.current === e.currentTarget) {
              focusNextInput(inputRefMinutes);
            }
            break;
          case "minutes":
            if (inputRefMinutes.current === e.currentTarget) {
              focusNextInput(inputRefSeconds);
            }
            break;
          case "seconds":
            break;
          default:
            break;
        }
      }

      switch (name) {
        case "hours":
          maxValue = maxHours;
          break;
        case "minutes":
          maxValue = maxMinutes;
          break;
        case "seconds":
          maxValue = maxSeconds;
          break;
        default:
          maxValue = MAX_TIME_UNIT;
          break;
      }

      if (numericValue <= maxValue) {
        setSnippetTime({
          ...snippetTime,
          [name]: leadingZeroFormatter.format(numericValue),
        });
      }
    }
  };

  return (
    <div>
      <div className="timespaninput group disabled flex h-10 w-full items-center rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
        <input
          type="number"
          name="hours"
          value={snippetTime.hours}
          onChange={handleInputChange}
          maxLength={2}
          max={maxHours}
          min={0}
          style={{
            width: "20px",
            textAlign: "center",
          }}
          ref={inputRefHours}
          onClick={() => inputRefHours.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
          readOnly={readOnly}
        />
        <span>:</span>
        <input
          type="number"
          name="minutes"
          value={snippetTime.minutes}
          onChange={handleInputChange}
          maxLength={2}
          max={maxMinutes}
          min={0}
          style={{ width: "20px", textAlign: "center" }}
          ref={inputRefMinutes}
          onClick={() => inputRefMinutes.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
          readOnly={readOnly}
        />
        <span>:</span>
        <input
          type="number"
          name="seconds"
          value={snippetTime.seconds}
          onChange={handleInputChange}
          maxLength={2}
          max={maxSeconds}
          min={0}
          style={{ width: "20px", textAlign: "center" }}
          ref={inputRefSeconds}
          onClick={() => inputRefSeconds.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
