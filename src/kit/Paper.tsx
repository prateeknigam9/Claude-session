import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** Full-frame paper stock with a soft vignette. Put scenes on top. */
export const PaperBackground: React.FC<{ color?: string; vignette?: number; children?: React.ReactNode }> = ({
  color = C.paper,
  vignette = 0.35,
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    {children}
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`,
      }}
    />
  </AbsoluteFill>
);

/**
 * Film/paper grain that "boils" every 2 frames. Place once, last, over the
 * whole composition so every template shares the same texture.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Jagged polygon for torn paper edges. Deterministic per seed. */
export const tornClipPath = (seed: string, roughness = 1.4, edges: ("t" | "r" | "b" | "l")[] = ["t", "r", "b", "l"]) => {
  const pts: string[] = [];
  const steps = 28;
  const j = (i: number, side: string) => (random(`${seed}-${side}-${i}`) * roughness).toFixed(2);
  for (let i = 0; i <= steps; i++) pts.push(`${(i / steps) * 100}% ${edges.includes("t") ? j(i, "t") : 0}%`);
  for (let i = 0; i <= steps; i++) pts.push(`${100 - (edges.includes("r") ? +j(i, "r") : 0)}% ${(i / steps) * 100}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${(i / steps) * 100}% ${100 - (edges.includes("b") ? +j(i, "b") : 0)}%`);
  for (let i = steps; i >= 0; i--) pts.push(`${edges.includes("l") ? j(i, "l") : 0}% ${(i / steps) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

/** A piece of torn paper with a lifted drop shadow. */
export const TornPaper: React.FC<{
  seed: string;
  width: number;
  height: number;
  color?: string;
  roughness?: number;
  edges?: ("t" | "r" | "b" | "l")[];
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ seed, width, height, color = C.paperLight, roughness = 1.4, edges, style, innerStyle, children }) => {
  const clip = useMemo(() => tornClipPath(seed, roughness, edges), [seed, roughness, edges]);
  return (
    <div style={{ width, height, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.28))", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: color,
          clipPath: clip,
          position: "relative",
          overflow: "hidden",
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Strip of masking tape. */
export const Tape: React.FC<{ x: number; y: number; rotate?: number; width?: number }> = ({ x, y, rotate = -8, width = 140 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height: 38,
      transform: `rotate(${rotate}deg)`,
      background: "rgba(236,226,196,0.78)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      clipPath: tornClipPath(`tape-${x}-${y}`, 6, ["l", "r"]),
    }}
  />
);
