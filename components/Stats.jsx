const STATS = [
  { value: 58, label: "Increase in pick up point use" },
  { value: 23, label: "Decrease in customer phone calls" },
  { value: 27, label: "Increase in pick up point use" },
  { value: 40, label: "Decrease in customer phone calls" },
];

/** Impact metrics. GSAP reveals each card and counts the number up. */
export default function Stats() {
  return (
    <ul id="stats" className="abs">
      {STATS.map((s, i) => (
        <li key={i}>
          <b>
            <span data-count={s.value}>0</span>
            <em>%</em>
          </b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}
