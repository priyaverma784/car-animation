import gsap from "gsap";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Loader counter, curtain reveal, then the orchestrated intro (car drive-in, headline, stats). */
export function playLoader(root, state, onDone) {
  const q = (s) => gsap.utils.toArray(s, root);
  const pct = root.querySelector("#pct");
  const counter = { v: 0 };

  const intro = () => {
    const t = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: onDone });
    t.to("#canvas", { opacity: 1, duration: 1.2, ease: "power2.inOut" })
      .to(state, { introX: 0, duration: 2.6, ease: "expo.out" }, 0) // car drives in
      .to("nav", { opacity: 1, duration: 1 }, 0.4)
      .to(".l i", { yPercent: 0, duration: 1.1, stagger: 0.055, ease: "expo.out" }, 0.5)
      .to("#sub", { opacity: 1, duration: 1 }, 1.3)
      .fromTo(
        "#stats li",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: "power2.out" },
        1.4,
      )
      .to("#rail, #hint", { opacity: 1, duration: 1 }, 2.4);
    q("#stats li").forEach((el, i) => t.add(() => el.classList.add("on"), 1.7 + i * 0.18));
    q("[data-count]").forEach((el) => {
      const c = { v: 0 };
      t.to(
        c,
        {
          v: +el.dataset.count,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => (el.textContent = Math.round(c.v)),
        },
        1.6,
      );
    });
    if (reduced()) t.progress(1);
  };

  gsap
    .timeline()
    .to(counter, {
      v: 100,
      duration: reduced() ? 0.1 : 1.4,
      ease: "power2.inOut",
      onUpdate: () => (pct.textContent = Math.round(counter.v)),
    })
    .to("#loader", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.1")
    .add(intro, "-=0.5");
}

/** One scrubbed timeline: drives 3D progress, the watermark parallax and the overlay copy. */
export function buildScrollTimeline(root, state) {
  const S = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  S.to(state, { progress: 1, duration: 1, ease: "none" }, 0)
    .to("#headline", { yPercent: -70, opacity: 0, duration: 0.12, ease: "none" }, 0.02)
    .to("#stats", { y: 80, opacity: 0, duration: 0.1, ease: "none" }, 0.02)
    .to("#hint", { opacity: 0, duration: 0.04, ease: "none" }, 0)
    .to("#mark", { xPercent: -18, scale: 1.15, duration: 1, ease: "none" }, 0)
    .to("#bar", { scaleY: 1, duration: 1, ease: "none" }, 0);
  gsap.utils.toArray(".chap", root).forEach((el, i) => {
    const t = 0.18 + i * 0.26;
    S.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, ease: "none" }, t).to(
      el,
      { opacity: 0, y: -40, duration: 0.08, ease: "none" },
      t + 0.16,
    );
  });
  S.fromTo("#closing", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08, ease: "none" }, 0.9);
  return S;
}
