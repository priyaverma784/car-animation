const CHAPTERS = [
  {
    title: "Built for the open road",
    text: "Low, wide and planted. Keep scrolling to circle the car.",
    right: false,
  },
  {
    title: "Every angle, in real time",
    text: "Reflections, glow and shadows are rendered live, not baked.",
    right: true,
  },
  {
    title: "From above, it all lines up",
    text: "The wheels turn exactly as far as you scroll, and no further.",
    right: false,
  },
];

export default function Chapters() {
  return CHAPTERS.map((c) => (
    <div key={c.title} className={`chap pointer-events-none absolute bottom-[16%] z-[3] max-w-sm px-6 opacity-0 md:px-[6vw] ${c.right ? "right-0 text-right" : "left-0"}`}>
      <i className={`mb-[18px] block h-px w-11 bg-orange-500/80 ${c.right ? "ml-auto" : ""}`} />

      <h2 className="m-0 font-[var(--font-cormorant)] text-[clamp(2rem,4.2vw,3.4rem)] font-medium leading-[1.05] tracking-[-.01em] text-white">
        {c.title}
      </h2>

      <p className="mt-4 font-[var(--font-manrope)] text-[.82rem] font-normal leading-[1.7] tracking-[.015em] text-[#a6afc1]">
        {c.text}
      </p>
    </div>
  ));
}