import React from "react";
import { random } from "remotion";
import { C, F } from "../theme";
import { useProgress } from "./Motion";

/** Hand-wobbled ellipse path so circles look drawn with a marker. */
const wobblyEllipse = (w: number, h: number, seed: string) => {
  const cx = w / 2, cy = h / 2, n = 40;
  let d = "";
  for (let i = 0; i <= n + 4; i++) {
    const a = (i / n) * Math.PI * 2 - 0.4;
    const r = 1 + (random(`${seed}${i % n}`) - 0.5) * 0.06 + (i > n ? 0.05 : 0);
    const x = cx + Math.cos(a) * (w / 2 - 6) * r;
    const y = cy + Math.sin(a) * (h / 2 - 6) * r;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
};

type Pos = { x: number; y: number; delay?: number; color?: string; stroke?: number };

/** Red marker circle that draws itself around something. */
export const MarkerCircle: React.FC<Pos & { w: number; h: number; seed?: string }> = ({
  x, y, w, h, delay = 0, color = C.red, stroke = 7, seed = "c",
}) => {
  const p = useProgress(delay, 16);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h}>
      <path d={wobblyEllipse(w, h, seed)} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.9} />
    </svg>
  );
};

/** Red X: two strokes, drawn one after the other. */
export const MarkerX: React.FC<Pos & { size?: number }> = ({ x, y, size = 80, delay = 0, color = C.red, stroke = 9 }) => {
  const a = useProgress(delay, 6);
  const b = useProgress(delay + 6, 6);
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={size} height={size}>
      <path d={`M4,6 L${size - 4},${size - 2}`} stroke={color} strokeWidth={stroke} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      <path d={`M${size - 6},4 L6,${size - 6}`} stroke={color} strokeWidth={stroke} strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - b} />
    </svg>
  );
};

/** Survey-style "x———x" measurement marks seen in the collage posters. */
export const MeasureMark: React.FC<Pos & { length: number; vertical?: boolean }> = ({
  x, y, length, vertical = false, delay = 0, color = C.red,
}) => {
  const p = useProgress(delay, 14);
  const L = length * p;
  const t = (cx: number, cy: number) => `M${cx - 9},${cy - 9} L${cx + 9},${cy + 9} M${cx + 9},${cy - 9} L${cx - 9},${cy + 9}`;
  const d = vertical ? `M0,0 L0,${L} ${t(0, 0)} ${p > 0.98 ? t(0, length) : ""}` : `M0,0 L${L},0 ${t(0, 0)} ${p > 0.98 ? t(length, 0) : ""}`;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
      <path d={d} stroke={color} strokeWidth={3} fill="none" opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};

/** Hand-drawn arrow with a curve, optional handwritten note at its tail. */
export const MarkerArrow: React.FC<Pos & { to: [number, number]; bend?: number; note?: string }> = ({
  x, y, to, bend = 60, delay = 0, color = C.red, note, stroke = 5,
}) => {
  const p = useProgress(delay, 14);
  const [tx, ty] = [to[0] - x, to[1] - y];
  const mx = tx / 2 - (ty / Math.hypot(tx, ty)) * bend;
  const my = ty / 2 + (tx / Math.hypot(tx, ty)) * bend;
  const ang = Math.atan2(ty - my, tx - mx);
  const head = (s: number) =>
    `M${tx},${ty} L${tx - Math.cos(ang - 0.5) * s},${ty - Math.sin(ang - 0.5) * s} M${tx},${ty} L${tx - Math.cos(ang + 0.5) * s},${ty - Math.sin(ang + 0.5) * s}`;
  return (
    <>
      <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={1} height={1}>
        <path d={`M0,0 Q${mx},${my} ${tx},${ty}`} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={head(26)} stroke={color} strokeWidth={stroke} strokeLinecap="round" opacity={p > 0.95 ? 1 : 0} />
      </svg>
      {note && (
        <div style={{ position: "absolute", left: x - 40, top: y - 62, fontFamily: F.hand, fontSize: 46, color, opacity: p, whiteSpace: "nowrap" }}>
          {note}
        </div>
      )}
    </>
  );
};

/** Inline highlighter swipe behind text (mustard, multiply). */
export const Highlight: React.FC<{ delay?: number; color?: string; children: React.ReactNode }> = ({
  delay = 0, color = C.mustard, children,
}) => {
  const p = useProgress(delay, 12);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p * 100}% 78%`,
        backgroundPosition: "0 70%",
        padding: "0 4px",
        mixBlendMode: "multiply",
      }}
    >
      {children}
    </span>
  );
};

/** Rubber stamp: thumps in, slightly rotated, ink texture knocked out. */
export const Stamp: React.FC<Pos & { text: string; sub?: string; rotate?: number; size?: number }> = ({
  x, y, text, sub, rotate = -10, size = 64, delay = 0, color = C.red,
}) => {
  const p = useProgress(delay, 7);
  const s = 1.7 - 0.7 * p;
  return (
    <div
      style={{
        position: "absolute", left: x, top: y,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${s})`,
        opacity: p > 0 ? 0.88 : 0,
        border: `${size / 9}px solid ${color}`, borderRadius: 12, padding: `${size / 6}px ${size / 2.4}px`,
        color, fontFamily: F.head, fontWeight: 700, fontSize: size, letterSpacing: 4, textAlign: "center",
        lineHeight: 1, mixBlendMode: "multiply",
        maskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,0.75) 61%, #000 75%)",
      }}
    >
      {text}
      {sub && <div style={{ fontFamily: F.type, fontSize: size * 0.32, letterSpacing: 2, marginTop: 8, fontWeight: 400 }}>{sub}</div>}
    </div>
  );
};
