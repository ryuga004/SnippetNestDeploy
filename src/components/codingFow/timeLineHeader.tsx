import React from "react";
import { cn } from "@/lib/utils";

const steps = [
  "Select Language",
  "Solve a Problem",
  "Run & Debug",
  "Get Rewards",
];

const TimelineHeader = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-between w-full max-w-3xl px-4">
      {steps.map((label, index) => (
        <div key={label} className="flex-1 text-center relative">
          <div
            className={cn(
              "rounded-full w-8 h-8 mx-auto mb-2",
              index <= currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-500"
            )}
          >
            {index + 1}
          </div>
          <p
            className={cn(
              "text-xs font-medium",
              index === currentStep ? "text-green-600" : "text-gray-500"
            )}
          >
            {label}
          </p>
          {index < steps.length - 1 && (
            <div className="absolute top-4 left-1/2 w-full h-[2px] bg-gray-300 z-[-1]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TimelineHeader;
