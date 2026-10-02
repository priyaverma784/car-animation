# Itzfizz: scroll-driven 3D hero

Next.js (App Router) + Tailwind CSS + GSAP ScrollTrigger + Three.js + Lenis.

## Run locally
    npm install
    npm run dev          # http://localhost:3000

## Structure
    app/            layout (fonts), page, globals.css
    components/     Hero (orchestrates), CarScene (Three.js), Headline, Stats, Chapters
    hooks/          useSmoothScroll (Lenis + GSAP ticker)
    lib/            buildCar (3D car), cameraPath (camera keyframes), timelines (GSAP)

## How it works
1. Loader counts to 100, slides away, then one intro timeline runs: the car drives in, the
   headline letters rise out of masks, and the stats appear one by one with a count-up.
2. A 600svh section holds a sticky stage. One scrubbed ScrollTrigger timeline writes
   `state.progress` (0..1) and animates the overlay text and watermark.
3. The 3D scene never reads scroll. Each frame it eases toward `state.progress`, moves the camera
   along keyframes, slides the road, spins the wheels, and reacts to scroll velocity
   (field of view, streaks, underglow) and the mouse (parallax).
4. Only transforms and opacity are animated in the DOM; one rAF loop renders the canvas.
   Everything is cleaned up on unmount, and prefers-reduced-motion is respected.

## Using a real car model
Export a .glb (nose toward +X), load it with GLTFLoader, and return `{ group, wheels }` from `buildCar`.
