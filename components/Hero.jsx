"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Headline from "./Headline";
import Stats from "./Stats";
import Chapters from "./Chapters";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { playLoader, buildScrollTimeline } from "@/lib/timelines";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const CarScene = dynamic(() => import("./CarScene"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);

  const state = useRef({
    progress: 0,
    vel: 0,
    introX: -14,
  });

  const lenisRef = useSmoothScroll();

  useEffect(() => {
    const element = root.current;

    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.set(".l i", {
        y: 0,
        yPercent: 115,
      });

      gsap.set("#bar", {
        scaleY: 0,
        transformOrigin: "top",
      });

      ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          state.current.vel = self.getVelocity();
        },
      });

      buildScrollTimeline(element, state.current);

      playLoader(element, state.current, () => {
        lenisRef.current?.start();
      });
    }, element);

    return () => {
      ctx.revert();
    };
  }, [lenisRef]);

  return (
    <section ref={root} aria-label="Welcome to Itzfizz" className={`${manrope.variable} ${cormorant.variable} relative h-[600svh] bg-[#06080c] font-[var(--font-manrope)] text-white`}>
      <div id="loader" className="fixed inset-0 z-50 grid place-items-center bg-[#06080c] will-change-transform">
        <div className="flex flex-col items-center">
          <span className="mb-4 text-[9px] font-semibold uppercase tracking-[0.55em] text-white/35">
            ITZFIZZ
          </span>

          <p id="pct" className="m-0 font-[var(--font-cormorant)] text-[clamp(4rem,9vw,7rem)] font-medium leading-none tracking-[-0.04em] text-white">
            0
          </p>

          <div className="mt-6 h-px w-28 overflow-hidden bg-white/10">
            <div className="h-full w-full origin-left scale-x-0 bg-orange-500" />
          </div>

          <span className="mt-4 text-[8px] font-medium uppercase tracking-[0.42em] text-white/25">
            Preparing the experience
          </span>
        </div>
      </div>

      <div id="stage" className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_70%_55%_at_50%_58%,#1a2030_0%,#0a0d14_70%)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_60%,rgba(32,40,59,.9)_0%,rgba(16,21,33,.7)_45%,rgba(8,10,16,1)_100%)]" />

        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[65vw] max-w-[900px] -translate-x-1/2 rounded-full bg-orange-500/[0.04] blur-[110px]" />

        <h2 id="mark" aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 m-0 flex items-center justify-center whitespace-nowrap font-[var(--font-cormorant)] text-[clamp(6rem,27vw,25rem)] font-semibold leading-none tracking-[0.055em] text-transparent will-change-transform [-webkit-text-stroke:1px_rgba(255,255,255,.065)]">
          ITZFIZZ
        </h2>

        <div id="canvas" className="absolute inset-0 z-[1] opacity-0">
          <CarScene stateRef={state} />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(6,8,12,.45)_72%,rgba(6,8,12,.92)_100%)]" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-[#080a10]/90 to-transparent" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-48 bg-gradient-to-t from-[#080a10]/80 to-transparent" />

        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 z-[2] opacity-[.055] mix-blend-overlay" />

        <nav aria-label="Main navigation" className="absolute inset-x-0 top-0 z-[5] flex items-center justify-between border-b border-white/[.055] px-5 py-6 opacity-0 sm:px-8 md:px-[4vw]">
          <a href="#stage" aria-label="Itzfizz home" className="group flex items-center gap-3 no-underline text-white">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-orange-500/40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-orange-500" />
            </span>

            <span className="font-[var(--font-manrope)] text-[.72rem] font-bold tracking-[.38em] transition-colors duration-300 group-hover:text-orange-300">
              ITZFIZZ
            </span>
          </a>

          <ul className="m-0 hidden list-none items-center gap-10 p-0 text-[10px] font-medium uppercase tracking-[.16em] text-white/40 md:flex">
            {["Models", "Technology", "Story", "Contact"].map((item) => (
              <li key={item} className="cursor-pointer transition-colors duration-300 hover:text-white">
                {item}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 text-[8px] font-medium uppercase tracking-[.2em] text-white/35 md:hidden">
            <span className="h-1 w-1 rounded-full bg-orange-500" />
            Performance
          </div>
        </nav>

        <div id="rail" aria-hidden="true" className="absolute bottom-1/4 right-[clamp(14px,2.4vw,34px)] top-1/4 z-[4] w-px bg-white/10 opacity-0">
          <div id="bar" className="absolute inset-0 origin-top bg-gradient-to-b from-orange-300 via-orange-500 to-amber-700 shadow-[0_0_12px_rgba(249,115,22,.45)]" />
        </div>

        <div id="headline" className="absolute inset-x-0 top-[15%] z-[3] px-6 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-3 rounded-full border border-white/[.09] bg-white/[.025] px-4 py-2 backdrop-blur-md">
            <span className="h-1 w-1 rounded-full bg-orange-500" />

            <span className="text-[8px] font-semibold uppercase tracking-[.3em] text-white/45">
              The art of driving
            </span>
          </div>

          <div className="font-[var(--font-cormorant)] [&_*]:font-[var(--font-cormorant)]">
            <Headline />
          </div>

          <p id="sub" className="mt-[26px] flex items-center justify-center gap-[18px] font-[var(--font-manrope)] text-[9px] font-medium tracking-[.42em] text-[#a6afc1] opacity-0 before:h-px before:w-[clamp(24px,6vw,70px)] before:bg-gradient-to-r before:from-transparent before:to-orange-500 before:content-[''] after:h-px after:w-[clamp(24px,6vw,70px)] after:bg-gradient-to-l after:from-transparent after:to-orange-500 after:content-['']">
            PRECISION IN MOTION
          </p>
        </div>

        <Stats />

        <Chapters />

        <p id="closing" className="absolute inset-x-0 top-[15%] z-[3] m-0 px-6 text-center font-[var(--font-cormorant)] text-[clamp(1.4rem,3.4vw,3rem)] font-medium leading-none tracking-[.28em] text-white opacity-0 sm:tracking-[.38em]">
          READY WHEN YOU ARE
        </p>

        <div id="hint" className="absolute inset-x-0 bottom-[2.2%] z-[3] flex flex-col items-center gap-3 font-[var(--font-manrope)] text-[8px] font-semibold uppercase tracking-[.4em] text-white/35 opacity-0">
          <span>Scroll to explore</span>

          <span className="block h-[30px] w-px animate-[drip_1.8s_ease-in-out_infinite] bg-gradient-to-b from-orange-300 via-orange-500 to-transparent" />
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute bottom-[3%] left-5 z-[3] hidden items-center gap-3 font-[var(--font-manrope)] text-[8px] font-medium uppercase tracking-[.22em] text-white/25 sm:flex md:left-[4vw]">
          <span className="text-orange-400">01</span>

          <span className="h-px w-7 bg-white/15" />

          <span>Experience</span>
        </div>
      </div>
    </section>
  );
}