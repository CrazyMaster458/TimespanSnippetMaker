import { useState, ChangeEvent } from "react";

export const TestPage = () => {
  const [sliderValue, setSliderValue] = useState(100);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Update the state with the new value of the slider
    setSliderValue(Number(event.target.value)); // Convert the value to a number
  };

  return (
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      value={sliderValue}
      onChange={handleSliderChange}
    />
  );
};
