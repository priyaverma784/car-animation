/**
 * Letter-spaced headline. Every letter sits in an overflow-hidden mask (.l) so it can rise into view.
 * The ".l i" class names are the hooks GSAP targets in lib/timelines.js.
 */
export default function Headline({ words = ["WELCOME", "ITZFIZZ"] }) {
  return (
    <h1
      id="h1"
      aria-label={words.join(" ")}
      className="m-0 flex flex-wrap justify-center gap-x-[1.8em] gap-y-[.6em] font-display text-[clamp(.95rem,3.1vw,2.7rem)] font-normal leading-[1.3]"
    >
      {words.map((word) => (
        <span key={word} className="flex" aria-hidden="true">
          {[...word].map((ch, i) => (
            <span key={i} className="l inline-block overflow-hidden pb-[.12em] pr-[.42em]">
              <i className="inline-block translate-y-[115%] bg-gradient-to-b from-white from-20% to-[#8d98ae] bg-clip-text not-italic text-transparent will-change-transform">
                {ch}
              </i>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
