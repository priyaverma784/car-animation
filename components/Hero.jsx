"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Headline from "./Headline";
import Stats from "./Stats";
import Chapters from "./Chapters";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { playLoader, buildScrollTimeline } from "@/lib/timelines";

// Three.js needs the browser, so the scene is client-only
const CarScene = dynamic(() => import("./CarScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);
  // Shared with the 3D scene: scroll progress (0..1), scroll velocity, car drive-in offset
  const state = useRef({ progress: 0, vel: 0, introX: -14 });
  const lenisRef = useSmoothScroll();

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => (state.current.vel = self.getVelocity()),
      });
      buildScrollTimeline(root.current, state.current);
      playLoader(root.current, state.current, () => lenisRef.current?.start());
    }, root);
    return () => ctx.revert(); // kills tweens and ScrollTriggers
  }, [lenisRef]);

  return (
    <section ref={root} aria-label="Welcome to Itzfizz" className="relative h-[600svh]">
      <div id="loader">
        <p id="pct">0</p>
      </div>

      <div id="stage" className="sticky top-0 h-[100svh] overflow-hidden">
        <h2 id="mark" className="abs" aria-hidden="true">
          ITZFIZZ
        </h2>
        <div id="canvas">
          <CarScene stateRef={state} />
        </div>
        <div id="vig" className="layer" />
        <div id="grain" className="layer" />

        <nav>
          <b>ITZFIZZ</b>
          <ul>
            <li>Models</li>
            <li>Technology</li>
            <li>Story</li>
            <li>Contact</li>
          </ul>
        </nav>
        <div id="rail">
          <div id="bar" />
        </div>

        <div id="headline" className="abs">
          <Headline />
          <p id="sub">PRECISION IN MOTION</p>
        </div>
        <Stats />
        <Chapters />
        <p id="closing" className="abs">
          READY WHEN YOU ARE
        </p>
        <div id="hint" className="abs">
          <span>SCROLL</span>
          <u />
        </div>
      </div>
    </section>
  );
}
