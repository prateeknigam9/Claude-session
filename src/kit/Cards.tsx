import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, F } from "../theme";
import { Typewriter } from "./Text";
import { PaperBackground } from "./Paper";

/** Template 10: black chapter card. */
export const ChapterCard: React.FC<{ index: number; title: string }> = ({ index, title }) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const t = interpolate(frame, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0E0E0D", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <Typewriter text={`CHAPTER ${String(index).padStart(2, "0")}`} style={{ fontSize: 34, color: "rgba(244,238,225,0.7)", letterSpacing: 6 }} cursor={false} />
        <div style={{ height: 6, width: 220, background: C.red, margin: "26px auto", transform: `scaleX(${bar})` }} />
        <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 140, color: C.paperLight, letterSpacing: 4, opacity: t,
          transform: `translateY(${(1 - t) * 20}px)` }}>
          {title.toUpperCase()}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Template 9: big-number card with count-up. */
export const BigNumber: React.FC<{ value: number; prefix?: string; suffix?: string; label: string; source?: string; decimals?: number }> = ({
  value, prefix = "", suffix = "", label, source, decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [6, fps * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lab = interpolate(frame, [fps * 1.2, fps * 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <PaperBackground>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 380, color: C.red, lineHeight: 1, letterSpacing: -4 }}>
          {prefix}{(value * p).toFixed(decimals)}{suffix}
        </div>
        <div style={{ fontFamily: F.head, fontWeight: 500, fontSize: 64, color: C.ink, opacity: lab, letterSpacing: 3, marginTop: 10 }}>
          {label.toUpperCase()}
        </div>
        {source && <div style={{ fontFamily: F.type, fontSize: 26, color: C.inkSoft, opacity: lab, marginTop: 24 }}>{source}</div>}
      </AbsoluteFill>
    </PaperBackground>
  );
};

/** Template 8: italic serif quote typed word by word over a darkened shot. */
export const QuoteCard: React.FC<{ quote: string; who: string; children?: React.ReactNode; wordsPerSec?: number }> = ({
  quote, who, children, wordsPerSec = 3.2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = quote.split(" ");
  const n = Math.floor(((frame - 10) / fps) * wordsPerSec);
  const whoO = interpolate(frame - 10, [(words.length / wordsPerSec) * fps, (words.length / wordsPerSec) * fps + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      {children}
      <AbsoluteFill style={{ background: "rgba(10,10,9,0.72)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ maxWidth: 1400, textAlign: "center" }}>
          <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 76, lineHeight: 1.3, color: C.paperLight }}>
            “{words.map((w, i) => (
              <span key={i} style={{ opacity: i < n ? 1 : 0 }}>{w} </span>
            ))}”
          </div>
          <div style={{ fontFamily: F.type, fontSize: 32, color: C.mustard, marginTop: 40, opacity: whoO }}>— {who}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Opening disclaimer card (builds trust in 3 seconds). */
export const DisclaimerCard: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ background: "#0E0E0D", justifyContent: "center", alignItems: "center" }}>
    <div style={{ maxWidth: 1200, textAlign: "center", fontFamily: F.type, fontSize: 38, lineHeight: 1.6, color: "rgba(244,238,225,0.85)" }}>
      {text}
    </div>
  </AbsoluteFill>
);
