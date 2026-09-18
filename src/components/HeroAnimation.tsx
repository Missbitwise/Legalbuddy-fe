"use client";

import {Lottie} from "lottie-react";

type HeroAnimationProps = {
  className?: string;
};

/** Reusable, responsive animation used in the landing-page hero. */
export function HeroAnimation({ className = "" }: HeroAnimationProps) {
  return (
    <Lottie
      src="/animations/animations/1ad5382f-55fa-4e14-911b-9718903771f7.json"
      autoplay
      loop
      className={`aspect-square w-full ${className}`}
    />
  );
}
