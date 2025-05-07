"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import TimelineHeader from "./timeLineHeader";
import FloatingLanguages from "./floatingLanguages";
import TypingCode from "./typingCode";
import SubmitAnimation from "./submitAnimation";
import RewardDisplay from "./rewardDisplay";
// animationCodingFlow ....
const AnimatedCodingFlow = () => {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
    }
  }, [isInView, started]);

  useEffect(() => {
    if (!started) return;

    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 6000);

    return () => clearTimeout(timer);
  }, [step, started]);

  const renderScene = () => {
    switch (step) {
      case 0:
        return <FloatingLanguages />;
      case 1:
        return <TypingCode language="C++" />;
      case 2:
        return <SubmitAnimation onComplete={() => {}} />;
      case 3:
        return <RewardDisplay />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-xl w-full"
    >
      <div className="w-full flex justify-center items-center h-[400px]">
        {started && renderScene()}
      </div>
      <TimelineHeader currentStep={step} />
    </div>
  );
};

export default AnimatedCodingFlow;
