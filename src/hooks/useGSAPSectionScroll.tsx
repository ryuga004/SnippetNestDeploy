"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGSAPZScrollSections = () => {
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!sectionRefs.current.length) return;

    sectionRefs.current.forEach((section) => {
      gsap.set(section, { transformStyle: "preserve-3d", z: 0 });

      gsap.to(section, {
        z: -500,
        scale: 0.8,
        opacity: 0.5,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const setRefs = (el: HTMLElement | null, index: number) => {
    if (el) sectionRefs.current[index] = el;
  };

  return { setRefs };
};
