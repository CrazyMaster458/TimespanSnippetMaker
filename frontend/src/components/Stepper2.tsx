import React from "react";
import classNames from "classnames";
import { Stepper, Step, Button } from "@material-tailwind/react";

export function YourComponent() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <>
    <div className="w-full py-4 px-8">
      <Stepper
        className="stepper opacity-100"
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step
          onClick={() => setActiveStep(0)}
          className={classNames(
            "cursor-pointer",
            {
              'bg-blue-600 text-white': activeStep === 0,
              'bg-gray-900 text-white': activeStep !== 0,
            },
            'relative z-10 grid place-items-center w-10 h-10 rounded-full font-bold transition-all duration-300'
          )}
        >
          1
        </Step>
        <Step
          onClick={() => setActiveStep(1)}
          className={classNames(
            "cursor-pointer",
            {
              'bg-blue-600 text-white': activeStep === 1,
              'text-gray-500': activeStep !== 1,
            },
            'relative z-10 grid place-items-center w-10 h-10 rounded-full font-bold transition-all duration-300'
          )}
        >
          2
        </Step>
        <Step
          onClick={() => setActiveStep(2)}
          className={classNames(
            "cursor-pointer",
            {
              'text-gray-500': activeStep !== 2,
            },
            'relative z-10 grid place-items-center w-10 h-10 rounded-full font-bold transition-all duration-300'
          )}
        >
          3
        </Step>
      </Stepper>
      <div className="mt-16 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
    </>
  );
}
