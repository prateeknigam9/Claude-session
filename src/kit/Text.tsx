import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";
import { tornClipPath } from "./Paper";

/** Typewriter reveal with a blinking red block cursor. */
export const Typewriter: React.FC<{
  text: string;
  delay?: number;
  cps?: number;
  style?: React.CSSProperties;
  cursor?: boolean;
}> = ({ text, delay = 0, cps = 22, style, cursor = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - delay) / fps) * cps));
  const shown = text.slice(0, n);
  const on = Math.floor(frame / 15) % 2 === 0 || n < text.length;
  return (
    <span style={{ fontFamily: F.type, whiteSpace: "pre", ...style }}>
      {shown}
      {cursor && frame >= delay && (
        <span style={{ display: "inline-block", width: "0.55em", height: "0.95em", marginLeft: 4, background: C.red, opacity: on ? 1 : 0, verticalAlign: "-0.1em" }} />
      )}
    </span>
  );
};

/** Template 1: establishing date stamp ("14 MAR 2009 · 9:12 AM▮"). */
export const DateStamp: React.FC<{ text: string; place?: string; delay?: number; x?: number; y?: number; dark?: boolean }> = ({
  text, place, delay = 0, x = 90, y = 80, dark = false,
}) => (
  <div style={{ position: "absolute", left: x, top: y, color: dark ? C.paperLight : C.ink }}>
    {place && <div style={{ fontFamily: F.head, fontSize: 26, letterSpacing: 6, opacity: 0.7, marginBottom: 6 }}>{place.toUpperCase()}</div>}
    <Typewriter text={text.toUpperCase()} delay={delay} style={{ fontSize: 44 }} />
  </div>
);

/**
 * Label-maker tag (black strip, cream condensed caps) — the "POWER / TRUTH?"
 * labels from the collage posters. `accent` makes it the red punchline.
 */
export const LabelTag: React.FC<{ text: string; x: number; y: number; delay?: number; accent?: boolean; rotate?: number; size?: number }> = ({
  text, x, y, delay = 0, accent = false, rotate = 0, size = 40,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute", left: x, top: y,
        transform: `rotate(${rotate}deg)`,
        clipPath: `inset(0 ${100 - p * 100}% 0 0)`,
        background: accent ? C.red : C.ink, color: C.paperLight,
        fontFamily: F.head, fontWeight: 700, fontSize: size, letterSpacing: 2,
        padding: `${size * 0.12}px ${size * 0.4}px`, boxShadow: "0 3px 6px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Template 2: name label with thin red bar. */
export const NameLabel: React.FC<{ name: string; role: string; x: number; y: number; delay?: number }> = ({ name, role, x, y, delay = 0 }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = interpolate(frame - delay, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 18, alignItems: "stretch" }}>
      <div style={{ width: 8, background: C.red, transform: `scaleY(${bar})`, transformOrigin: "top" }} />
      <div style={{ opacity: t, transform: `translateX(${(1 - t) * -20}px)` }}>
        <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 52, color: C.ink, lineHeight: 1 }}>{name}</div>
        <div style={{ fontFamily: F.type, fontSize: 26, color: C.inkSoft, marginTop: 8 }}>{role}</div>
      </div>
    </div>
  );
};

/** Template 4: two-step pills — black for context, then red for the punchline. */
export const TwoStepPills: React.FC<{ context: string; punch: string; x: number; y: number; delay?: number; gap?: number }> = ({
  context, punch, x, y, delay = 0, gap = 24,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const pill = (t: string, bg: string, d: number) => {
    const s = spring({ frame: frame - d, fps, config: { damping: 14, stiffness: 180 } });
    return (
      <div style={{ background: bg, color: C.paperLight, fontFamily: F.head, fontWeight: 700, fontSize: 40, letterSpacing: 2,
        padding: "10px 30px", borderRadius: 999, transform: `scale(${s})`, opacity: s, whiteSpace: "nowrap" }}>
        {t}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap }}>
      {pill(context, C.ink, delay)}
      <div style={{ fontFamily: F.head, fontSize: 40, color: C.ink, opacity: frame > delay + fps ? 1 : 0 }}>→</div>
      {pill(punch, C.red, delay + Math.round(fps * 1.2))}
    </div>
  );
};

/**
 * Ransom-note title: each letter on its own paper chip, slightly rotated,
 * mixed fonts. Used for the title card after the cold open.
 */
export const RansomTitle: React.FC<{ text: string; delay?: number; size?: number; stagger?: number }> = ({
  text, delay = 0, size = 150, stagger = 2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fonts = [F.head, F.type, F.head, F.serif];
  const bgs = [C.paperLight, C.ink, C.paperLight, C.mustard, C.paperLight, C.paperDark];
  let k = 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `${size * 0.12}px ${size * 0.35}px`, maxWidth: 1700 }}>
      {text.split(" ").map((word, wi) => (
        <div key={wi} style={{ display: "flex", gap: 6 }}>
          {word.split("").map((ch, ci) => {
            const i = k++;
            const r = (n: string) => random(`${text}-${i}-${n}`);
            const bg = bgs[Math.floor(r("bg") * bgs.length)];
            const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 12, stiffness: 200 } });
            return (
              <div key={ci} style={{
                background: bg, color: bg === C.ink ? C.paperLight : C.ink,
                fontFamily: fonts[Math.floor(r("f") * fonts.length)], fontWeight: 700,
                fontSize: size * (0.85 + r("s") * 0.25), lineHeight: 1, padding: `${size * 0.06}px ${size * 0.08}px`,
                transform: `rotate(${(r("r") - 0.5) * 9}deg) translateY(${(r("y") - 0.5) * 14}px) scale(${s})`,
                clipPath: tornClipPath(`${text}${i}`, 3), boxShadow: "0 4px 8px rgba(0,0,0,0.3)", opacity: s,
              }}>
                {ch}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Burned-in subtitles in a black band (always on, for sound-off viewers). */
export type Cue = { start: number; end: number; text: string };
export const Subtitles: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "rgba(12,12,11,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: 40, color: "#F5F1E8", maxWidth: 1600, textAlign: "center" }}>
        {cue.text}
      </div>
    </div>
  );
};

/** Honesty label: ILLUSTRATION / NOT TO SCALE / ACCORDING TO… */
export const HonestyTag: React.FC<{ text: string; dark?: boolean; x?: number; y?: number }> = ({ text, dark = false, x = 1580, y = 60 }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: F.type, fontSize: 22, letterSpacing: 3,
    color: dark ? "rgba(244,238,225,0.75)" : "rgba(28,27,24,0.65)", border: `2px solid currentColor`, padding: "4px 12px" }}>
    {text.toUpperCase()}
  </div>
);
