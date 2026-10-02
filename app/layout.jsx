import "./globals.css";
import { Syncopate, Instrument_Serif, Manrope } from "next/font/google";

const display = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-display" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const body = Manrope({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });

export const metadata = {
  title: "Itzfizz | Scroll-driven 3D hero",
  description: "A scroll-driven 3D hero built with Next.js, Tailwind, GSAP and Three.js.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${body.variable}`}>
      <body className="overflow-x-hidden bg-night font-body font-light text-[#eef1f8] antialiased">{children}</body>
    </html>
  );
}
