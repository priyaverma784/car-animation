
const STATS = [
  { value: 58, label: "Increase in pick-up point usage", tag: "CONVENIENCE" },
  { value: 23, label: "Reduction in customer phone calls", tag: "EFFICIENCY" },
  { value: 27, label: "Growth in pick-up point adoption", tag: "PERFORMANCE" },
  { value: 40, label: "Reduction in support calls", tag: "EXPERIENCE" },
];

// Premium glass card styling.
// GSAP adds the "on" class to reveal the orange accent line.
const CARD =
  "group relative isolate min-w-0 overflow-hidden rounded-2xl " +
  "border border-white/[0.12] bg-[#10131b]/75 " +
  "px-4 pb-5 pt-5 shadow-[0_12px_40px_rgba(0,0,0,0.20)] " +
  "backdrop-blur-xl transition-all duration-500 ease-out " +
  "hover:-translate-y-1 hover:border-orange-400/40 " +
  "hover:bg-[#151923]/90 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)] " +
  "opacity-0 will-change-[transform,opacity] " +
  "after:absolute after:bottom-0 after:left-4 after:h-[3px] " +
  "after:w-[38%] after:origin-left after:scale-x-0 " +
  "after:rounded-full after:bg-gradient-to-r after:from-orange-500 " +
  "after:to-amber-300 after:transition-transform after:duration-700 " +
  "after:ease-[cubic-bezier(.2,.8,.2,1)] after:content-[''] " +
  "[&.on]:after:scale-x-100";

export default function Stats() {
  return (
    <ul
      id="stats"
      aria-label="Performance statistics"
      className="
        absolute inset-x-0 bottom-[4%] z-[3]
        m-0 grid list-none grid-cols-2
        gap-3 px-4
        sm:gap-4 sm:px-6
        lg:bottom-[5%] lg:grid-cols-4
        lg:gap-4 lg:px-[6vw]
        xl:gap-5
      "
    >
      {STATS.map((stat, index) => (
        <li key={stat.tag} className={CARD}>
          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute -right-10 -top-12
              h-28 w-28 rounded-full
              bg-orange-500/[0.07] blur-3xl
              transition-all duration-500
              group-hover:bg-orange-500/[0.15]
            "
          />

          {/* Card header */}
          <div className="relative mb-4 flex items-center justify-between gap-2">
            <span
              className="
                text-[9px] font-semibold uppercase tracking-[0.2em]
                text-white/45 sm:text-[10px]
              "
            >
              {stat.tag}
            </span>

            <span
              className="
                font-mono text-[10px] tracking-widest
                text-orange-400/80
              "
            >
              0{index + 1}
            </span>
          </div>

          {/* Animated percentage counter */}
          <div className="relative flex items-baseline whitespace-nowrap">
            <b
              className="
                font-serif text-[clamp(2.5rem,4.2vw,4.1rem)]
                font-normal leading-none tracking-[-0.055em]
                text-white transition-colors duration-300
                group-hover:text-orange-50
              "
            >
              <span data-count={stat.value}>0</span>
            </b>

            <em
              className="
                ml-1 font-serif text-[clamp(1.1rem,2vw,1.8rem)]
                font-normal not-italic text-orange-400
              "
            >
              %
            </em>
          </div>

          {/* Metric description */}
          <p
            className="
              relative mt-4 mb-1 max-w-[22ch]
              text-[11px] font-normal leading-relaxed
              text-slate-300/75
              sm:text-xs md:text-sm
            "
          >
            {stat.label}
          </p>

          {/* Bottom micro-label */}
          <div className="relative mt-4 flex items-center gap-2">
            <span className="h-px w-5 bg-orange-500/70" />
            <span
              className="
                text-[8px] uppercase tracking-[0.18em]
                text-white/30 sm:text-[9px]
              "
            >
              Measurable impact
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}