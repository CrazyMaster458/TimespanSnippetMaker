import { TimeProp } from '@/types/type';
import React, { useRef, useState } from 'react';

type TimespanInputProps = {
  snippetTime: TimeProp;
  setSnippetTime: React.Dispatch<
    React.SetStateAction<TimeProp>
  >;
}

const MAX_TIME_UNIT = 59;

export const TimespanInput: React.FC<TimespanInputProps> = ({ snippetTime, setSnippetTime }) => {

  const inputRefHours = useRef<HTMLInputElement>(null);
  const inputRefMinutes = useRef<HTMLInputElement>(null);
  const inputRefSeconds = useRef<HTMLInputElement>(null);

  const [isArrowKey, setIsArrowKey] = useState(false);

  const handleArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsArrowKey(e.key === 'ArrowUp' || e.key === 'ArrowDown');
  };

  const focusNextInput = (currentInputRef: React.RefObject<HTMLInputElement> | null) => {
    if (currentInputRef?.current) {
      currentInputRef.current.focus();
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });
    const { name, value } = e.currentTarget;

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
            // if (inputRefSecondsStart.current === e.currentTarget) {
            //   inputRefHoursEnd.current?.focus();
            // }
            break;
          default:
            break;
        }
        
      }

      setSnippetTime({
        ...snippetTime,
        [name]: leadingZeroFormatter.format(
          Number(value) < MAX_TIME_UNIT ? Number(value) : MAX_TIME_UNIT
        ),
      });
    }
  };

  return (
    <div>
      <div className="timespaninput flex group items-center h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
        <input
          type="number"
          name="hours"
          value={snippetTime.hours}
          onChange={handleInputChange}
          maxLength={2}
          max={MAX_TIME_UNIT}
          min={0}
          style={{
            width: '20px',
            textAlign: 'center',
          }}
          ref={inputRefHours}
          onClick={() => inputRefHours.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
        />
        <span>:</span>
        <input
          type="number"
          name="minutes"
          value={snippetTime.minutes}
          onChange={handleInputChange}
          maxLength={2}
          max={MAX_TIME_UNIT}
          min={0}
          style={{ width: '20px', textAlign: 'center' }}
          ref={inputRefMinutes}
          onClick={() => inputRefMinutes.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
        />
        <span>:</span>
        <input
          type="number"
          name="seconds"
          value={snippetTime.seconds}
          onChange={handleInputChange}
          maxLength={2}
          max={MAX_TIME_UNIT}
          min={0}
          style={{ width: '20px', textAlign: 'center' }}
          ref={inputRefSeconds}
          onClick={() => inputRefSeconds.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleArrowKeys(e)}
        />
      </div>
    </div>
  );
};
