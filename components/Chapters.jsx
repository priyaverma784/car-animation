const CHAPTERS = [
  {
    title: "Built for the open road",
    text: "Low, wide and planted. Keep scrolling to circle the car.",
    side: "lft",
  },
  {
    title: "Every angle, in real time",
    text: "Reflections, glow and shadows are rendered live, not baked.",
    side: "r",
  },
  {
    title: "From above, it all lines up",
    text: "The wheels turn exactly as far as you scroll, and no further.",
    side: "lft",
  },
];

/** Captions that fade in and out at fixed points of the scroll timeline. */
export default function Chapters() {
  return CHAPTERS.map((c) => (
    <div key={c.title} className={`chap ${c.side}`}>
      <i />
      <h2>{c.title}</h2>
      <p>{c.text}</p>
    </div>
  ));
}
