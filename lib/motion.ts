import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Check if user prefers reduced motion for accessibility */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Editorial and calm easing curves */
export const EASING = {
  editorial: "power3.out",
  smooth: "power2.out",
  gentle: "sine.out",
  reveal: "expo.out",
} as const;

export { gsap, ScrollTrigger };

