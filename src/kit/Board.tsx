import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { tornClipPath } from "./Paper";

export type BoardNode = { id: string; x: number; y: number; title: string; body?: string; delay: number; w?: number; kind?: "card" | "photo" | "note" };
export type BoardLink = { from: string; to: string; delay: number };

/**
 * Case board: cards pinned to cork, red string drawn pin-to-pin with sag.
 * Coordinates are in the 1920×1080 frame; pin sits at the card's top centre.
 */
export const CaseBoard: React.FC<{ nodes: BoardNode[]; links: BoardLink[] }> = ({ nodes, links }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const pin = (n: BoardNode) => [n.x + (n.w ?? 300) / 2, n.y + 14] as const;
  return (
    <AbsoluteFill style={{ background: "#5A4A37" }}>
      {/* cork texture */}
      <AbsoluteFill style={{ opacity: 0.5, mixBlendMode: "multiply" }}>
        <svg width="100%" height="100%">
          <filter id="cork"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="3" /><feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 1.6 -0.4" /></filter>
          <rect width="100%" height="100%" filter="url(#cork)" />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,220,160,0.25), rgba(0,0,0,0.55) 80%)" }} />

      {nodes.map((n) => {
        const s = spring({ frame: frame - n.delay, fps, config: { damping: 14, stiffness: 160 } });
        const rot = (random(n.id) - 0.5) * 7;
        const w = n.w ?? 300;
        const bg = n.kind === "note" ? C.mustard : C.paperLight;
        return (
          <div key={n.id} style={{ position: "absolute", left: n.x, top: n.y, width: w, opacity: s,
            transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * s})`, filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.45))" }}>
            <div style={{ background: bg, clipPath: tornClipPath(n.id, 1), padding: 22 }}>
              {n.kind === "photo" && (
                <div style={{ height: 150, background: "linear-gradient(160deg,#77736a,#2b2a27)", marginBottom: 14 }} />
              )}
              <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{n.title}</div>
              {n.body && <div style={{ fontFamily: F.type, fontSize: 21, color: C.inkSoft, marginTop: 10, lineHeight: 1.35 }}>{n.body}</div>}
            </div>
          </div>
        );
      })}

      <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
        {links.map((l, i) => {
          const a = byId[l.from], b = byId[l.to];
          if (!a || !b) return null;
          const [x1, y1] = pin(a), [x2, y2] = pin(b);
          const sag = Math.hypot(x2 - x1, y2 - y1) * 0.12;
          const p = interpolate(frame - l.delay, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + sag} ${x2},${y2}`} stroke={C.red} strokeWidth={4}
              fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: "drop-shadow(0 3px 2px rgba(0,0,0,0.5))" }} />
          );
        })}
        {nodes.map((n) => {
          const [x, y] = pin(n);
          return frame >= n.delay ? (
            <g key={n.id}>
              <circle cx={x + 3} cy={y + 5} r={11} fill="rgba(0,0,0,0.35)" />
              <circle cx={x} cy={y} r={11} fill={C.red} />
              <circle cx={x - 3} cy={y - 3} r={3.5} fill="rgba(255,255,255,0.6)" />
            </g>
          ) : null;
        })}
      </svg>
    </AbsoluteFill>
  );
};
