"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, Loader } from "lucide-react";

const SubmitAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submit and accepted
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAccepted(true);

      // Move to the next step after a short delay
      setTimeout(onComplete, 2000);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={isSubmitting || isAccepted}
        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader className="animate-spin w-5 h-5" />
            Submitting...
          </div>
        ) : isAccepted ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" />
            Accepted
          </div>
        ) : (
          "Submit Code"
        )}
      </motion.button>

      {isAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-green-500 text-xl font-semibold"
        >
          🎉 Congratulations! Your solution was accepted!
        </motion.div>
      )}
    </div>
  );
};

export default SubmitAnimation;
