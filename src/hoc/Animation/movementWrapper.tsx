"use client";
import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MovementWrapperProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down" | "none";
  duration?: number;
  delay?: number;
  triggerOnScroll?: boolean;
}
// animation component ...
const MovementWrapper = ({
  children,
  direction = "up",
  duration = 1,
  delay = 0,
  triggerOnScroll = true,
}: MovementWrapperProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let x = 0,
      y = 0;

    if (direction === "left") x = -50;
    if (direction === "right") x = 50;
    if (direction === "up") y = 50;
    if (direction === "down") y = -50;
    if (direction === "none") x = 0;
    const animation = gsap.fromTo(
      ref.current,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
        scrollTrigger: triggerOnScroll
          ? {
              trigger: ref.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          : undefined,
      }
    );

    return () => {
      animation.kill();
    };
  }, [direction, duration, delay, triggerOnScroll]);

  return <div ref={ref}>{children}</div>;
};

export default MovementWrapper;
