import React from "react";
import AnimatedCodingFlow from "../codingFow/animatedCodingFlow";
import Image from "next/image";

const CodingOverview = () => {
  return (
    <div className="flex gap-3 w-full h-full">
      <aside className="w-1/2 h-[520px]">
        <Image
          src="https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Coding Overview Section Image"
          height={400}
          width={400}
          className="w-full h-full object-cover rounded-lg"
        />
      </aside>
      <main className="w-1/2">
        <AnimatedCodingFlow />
      </main>
    </div>
  );
};

export default CodingOverview;
