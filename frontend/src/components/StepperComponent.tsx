// StepperComponent.js
import { Stepper } from "./Stepper";
import { StepperControl } from "./StepperControl";
import { StepperContext } from "./contexts/StepperContext"
import { useState } from "react";
import { Guests } from "./steps/Guests";
import { Details } from "./steps/Details";
import { Upload } from "./steps/Upload";
import { Visibility } from "./steps/Visibility";

export function StepperComponent() {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState('');
    const [finalData, setFinalData] = useState([]);

    const steps = [
        "Upload",
        "Details",
        "Host & Guests",
        "Visibility"
    ];

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Upload />;
            case 2:
                return <Details />;
            case 3:
                return <Guests />;
            case 4:
                return <Visibility />;
            default:
                return null; // Handle default case or return null
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;

        direction == "next" ? newStep++ : newStep--;
        //check if steps are within bounds

        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    }

    return (
        <div className="md:w-1/2 mx-auto shadow-xl rounded-2xl pd-2 bg-white">
            <div className="container horizontal mt-5">
                <Stepper steps={steps} currentStep={currentStep} />
            </div>
            <StepperControl 
                handleClick={handleClick}
                currentStep={currentStep}
                steps={steps}
            />
            <div className="my-10 p-10">
                <StepperContext.Provider value={{
                    userData,
                    setUserData,
                    finalData,
                    setFinalData
                }}>{displayStep(currentStep)}</StepperContext.Provider>
            </div>
        </div>
    );
}
