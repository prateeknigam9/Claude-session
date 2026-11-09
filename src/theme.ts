import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Fonts are bundled in public/fonts (Google Fonts, SIL Open Font License) so
 * renders work offline and never stall on a font download.
 */
const font = (family: string, file: string, weight = "400", style = "normal") =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style, format: "woff2" });

font("Oswald", "oswald-500.woff2", "500");
font("Oswald", "oswald-700.woff2", "700");
font("Special Elite", "special-elite.woff2");
font("Playfair Display", "playfair-italic-400.woff2", "400", "italic");
font("Inter", "inter-400.woff2", "400");
font("Inter", "inter-600.woff2", "600");
font("Caveat", "caveat-600.woff2", "600");

/**
 * The whole look lives here. Swap these values to re-brand every template.
 * Rule of thumb from the references: muted paper + ink, ONE signal colour
 * (red) for emphasis, ONE highlight colour (mustard) for "look here".
 */
export const C = {
  paper: "#E9E1CF",
  paperLight: "#F4EEE1",
  paperDark: "#D6CBB3",
  kraft: "#B9A27E",
  ink: "#1C1B18",
  inkSoft: "#3A3833",
  red: "#C7372C",
  mustard: "#E3B23C",
  slate: "#6F8DAA",
  navy: "#1F2E44",
  teal: "#7FB7BE",
} as const;

export const F = {
  head: "Oswald, 'Arial Narrow', sans-serif",
  type: "'Special Elite', 'Courier New', monospace",
  serif: "'Playfair Display', Georgia, serif",
  body: "Inter, Arial, sans-serif",
  hand: "Caveat, cursive",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const sec = (s: number) => Math.round(s * FPS);
