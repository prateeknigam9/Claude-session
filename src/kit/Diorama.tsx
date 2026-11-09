import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";

export type Layer = { depth: number; node: React.ReactNode; shadow?: number };

/**
 * Paper-cut diorama: stacked flat layers with drop shadows. A slow camera
 * push moves near layers more than far ones (parallax), which sells the
 * "real paper in a box" look of the volcano / floating-city references.
 * depth: 0 = far background, 1 = nearest.
 */
export const PaperDiorama: React.FC<{ layers: Layer[]; duration: number; push?: number; driftX?: number; bg?: string }> = ({
  layers, duration, push = 0.08, driftX = -40, bg = "#7FB7BE",
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {layers.map((l, i) => {
        const s = 1 + push * t * (0.3 + l.depth);
        const dx = driftX * t * (0.2 + l.depth);
        const sh = l.shadow ?? 8 + l.depth * 14;
        return (
          <AbsoluteFill key={i} style={{ transform: `translateX(${dx}px) scale(${s})`,
            filter: `drop-shadow(0 ${sh * 0.5}px ${sh}px rgba(0,0,0,0.35))` }}>
            {l.node}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
