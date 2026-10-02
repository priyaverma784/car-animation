/** Letter-spaced headline. Every letter sits in a mask so it can rise into view. */
export default function Headline({ words = ["WELCOME", "ITZFIZZ"] }) {
  return (
    <h1 id="h1" aria-label={words.join(" ")}>
      {words.map((word) => (
        <span key={word} className="w" aria-hidden="true">
          {[...word].map((ch, i) => (
            <span key={i} className="l">
              <i>{ch}</i>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
