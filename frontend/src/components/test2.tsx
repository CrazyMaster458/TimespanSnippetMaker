/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";

export const Test = () => {
  const [snippetStart, setSnippetStart] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const inputRef = useRef(null);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    if (isValidTimeFormat(value) && name in snippetStart) {
      setSnippetStart({ ...snippetStart, [name]: value });
    }
  };

  const isValidTimeFormat = (value: string) => {
    const pattern = /^[0-5]?[0-9]$/;
    return pattern.test(value);
  };

  return (
    <div>
      <input
        type="text"
        name="hours"
        value={snippetStart.hours}
        onChange={handleInputChange}
        maxLength={2}
        style={{ width: "25px", textAlign: "center" }}
        ref={inputRef}
      />
      <span>:</span>
      <input
        type="text"
        name="minutes"
        value={snippetStart.minutes}
        onChange={handleInputChange}
        maxLength={2}
        style={{ width: "25px", textAlign: "center" }}
      />
      <span>:</span>
      <input
        type="text"
        name="seconds"
        value={snippetStart.seconds}
        onChange={handleInputChange}
        maxLength={2}
        style={{ width: "25px", textAlign: "center" }}
      />
    </div>
  );
};
