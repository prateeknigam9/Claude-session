import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";

export type MapPin = { x: number; y: number; label: string; delay: number };

/**
 * Template 7: paper map with a route that draws itself and labelled pins.
 * `land` is any SVG path in a 1920×1080 viewBox (trace a real outline from
 * a public-domain map, e.g. Natural Earth, and paste the `d` here).
 */
export const MapRoute: React.FC<{ land: string; route: string; pins: MapPin[]; routeDelay?: number; routeFrames?: number }> = ({
  land, route, pins, routeDelay = 10, routeFrames = 50,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - routeDelay, [0, routeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.slate }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80,0 L0,0 0,80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#grid)" />
        <path d={land} fill={C.paper} stroke={C.ink} strokeWidth={3} style={{ filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.3))" }} />
        <path d={route} fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeDasharray="1" pathLength={1}
          strokeDashoffset={1 - p} />
        {pins.map((pin, i) => {
          const o = interpolate(frame - pin.delay, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} opacity={o}>
              <circle cx={pin.x} cy={pin.y} r={16} fill={C.red} stroke={C.paperLight} strokeWidth={5} />
              <rect x={pin.x + 26} y={pin.y - 28} width={pin.label.length * 22 + 30} height={54} fill={C.ink} />
              <text x={pin.x + 41} y={pin.y + 12} fontFamily={F.head} fontWeight={700} fontSize={36} fill={C.paperLight}>{pin.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
