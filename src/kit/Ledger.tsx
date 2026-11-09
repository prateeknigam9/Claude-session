import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F } from "../theme";

export type LedgerRow = { label: string; value: string; flag?: string; flagDelay?: number };

/**
 * "What the auditors saw" — the finance version of the satellite-view motif.
 * A ledger page under corner brackets; rows can get red flag tags that pop in,
 * and one row can be highlighted.
 */
export const AuditorView: React.FC<{
  title: string;
  stamp: string;
  rows: LedgerRow[];
  highlightRow?: number;
  highlightDelay?: number;
}> = ({ title, stamp, rows, highlightRow, highlightDelay = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hl = interpolate(frame - highlightDelay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bracket = (pos: React.CSSProperties, rot: number) => (
    <div style={{ position: "absolute", width: 60, height: 60, borderTop: `5px solid ${C.ink}`, borderLeft: `5px solid ${C.ink}`, transform: `rotate(${rot}deg)`, ...pos }} />
  );
  return (
    <AbsoluteFill style={{ background: "#CFCAC0", filter: "grayscale(0.15)" }}>
      <div style={{ position: "absolute", left: 360, top: 90, width: 1200, height: 640, background: "#F7F4EC",
        boxShadow: "0 20px 40px rgba(0,0,0,0.25)", padding: "50px 70px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `3px solid ${C.ink}`, paddingBottom: 14 }}>
          <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 42, color: C.ink, letterSpacing: 2 }}>{title}</div>
          <div style={{ fontFamily: F.type, fontSize: 26, color: C.inkSoft, alignSelf: "flex-end" }}>{stamp}</div>
        </div>
        {rows.map((r, i) => {
          const fs = spring({ frame: frame - (r.flagDelay ?? 0), fps, config: { damping: 12, stiffness: 220 } });
          const isHl = i === highlightRow;
          return (
            <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center",
              fontFamily: F.type, fontSize: 34, color: C.ink, padding: "20px 12px", borderBottom: "1px dashed rgba(0,0,0,0.25)" }}>
              {isHl && (
                <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: `${hl * 100}%`, background: C.mustard, opacity: 0.6, mixBlendMode: "multiply" }} />
              )}
              <span style={{ position: "relative" }}>{r.label}</span>
              <span style={{ position: "relative" }}>{r.value}</span>
              {r.flag && r.flagDelay !== undefined && (
                <div style={{ position: "absolute", left: "calc(100% + 24px)", top: 18, background: C.red, color: "#fff", fontFamily: F.head, fontWeight: 700,
                  fontSize: 26, padding: "6px 14px", transform: `scale(${fs})`, transformOrigin: "left center", opacity: fs, whiteSpace: "nowrap" }}>
                  ◀ {r.flag}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {bracket({ left: 330, top: 60 }, 0)}
      {bracket({ left: 1530, top: 60 }, 90)}
      {bracket({ left: 1530, top: 700 }, 180)}
      {bracket({ left: 330, top: 700 }, 270)}
    </AbsoluteFill>
  );
};
