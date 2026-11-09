import React from "react";
import { Img } from "remotion";
import { C } from "../theme";
import { TornPaper } from "./Paper";

/**
 * Halftone cut-out photo: greyscale + contrast + dot screen, on torn paper.
 * Pass `src` (e.g. staticFile("person.png")) for real archive photos you
 * have rights to. Without src it draws a neutral silhouette placeholder.
 */
export const HalftonePhoto: React.FC<{
  seed: string;
  width: number;
  height: number;
  src?: string;
  tint?: string;
  dot?: number;
}> = ({ seed, width, height, src, tint, dot = 6 }) => (
  <TornPaper seed={seed} width={width} height={height} color={C.paperLight} roughness={1.2}>
    <div style={{ position: "absolute", inset: 0, filter: "grayscale(1) contrast(1.35)" }}>
      {src ? (
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Silhouette />
      )}
    </div>
    {/* dot screen */}
    <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.35,
      backgroundImage: `radial-gradient(circle, #000 ${dot * 0.28}px, transparent ${dot * 0.32}px)`, backgroundSize: `${dot}px ${dot}px` }} />
    {tint && <div style={{ position: "absolute", inset: 0, background: tint, mixBlendMode: "multiply" }} />}
  </TornPaper>
);

/** Faceless head-and-shoulders figure (low-key, like the reference video's characters). */
export const Silhouette: React.FC<{ color?: string; bg?: string }> = ({ color = "#2A2926", bg = "#BDB6A6" }) => (
  <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style={{ background: bg }}>
    <defs>
      <radialGradient id="sil-l" cx="40%" cy="30%" r="70%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="500" fill="url(#sil-l)" />
    <ellipse cx="200" cy="190" rx="88" ry="108" fill={color} />
    <path d="M60,500 C60,370 120,320 200,320 C280,320 340,370 340,500 Z" fill={color} />
    <rect x="170" y="280" width="60" height="60" fill={color} />
    {/* collar + tie hint */}
    <path d="M168,330 L200,380 L232,330 Z" fill="#E9E1CF" opacity="0.85" />
    <path d="M194,350 L206,350 L212,430 L200,450 L188,430 Z" fill={C.red} opacity="0.85" />
  </svg>
);

/** Newspaper/document scrap: fake body copy rendered as type lines. */
export const DocScrap: React.FC<{ seed: string; width: number; height: number; heading?: string; lines?: number; color?: string }> = ({
  seed, width, height, heading, lines = 10, color = C.paperLight,
}) => (
  <TornPaper seed={seed} width={width} height={height} color={color} roughness={2}>
    <div style={{ padding: 22 }}>
      {heading && (
        <div style={{ fontFamily: "serif", fontWeight: 700, fontSize: 26, color: C.ink, marginBottom: 12, lineHeight: 1.1 }}>{heading}</div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 7, margin: "9px 0", background: "rgba(28,27,24,0.55)",
          width: `${70 + ((i * 37) % 30)}%` }} />
      ))}
    </div>
  </TornPaper>
);

/** Striped hazard block (red/cream diagonal stripes) from the collage refs. */
export const Stripes: React.FC<{ width: number; height: number; color?: string }> = ({ width, height, color = C.red }) => (
  <div style={{ width, height, background: `repeating-linear-gradient(-45deg, ${color} 0 22px, ${C.paperLight} 22px 44px)` }} />
);
