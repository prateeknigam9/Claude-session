import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/**
 * "Slap-down": a cut-out lands on the table. Starts slightly big, rotated
 * and transparent, settles with a spring. Core motion of the collage style.
 */
export const Drop: React.FC<{
  delay?: number;
  x: number;
  y: number;
  rotate?: number;
  from?: "above" | "left" | "right" | "below" | "scale";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, x, y, rotate = 0, from = "scale", children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
  const off = (1 - p) * 140;
  const dx = from === "left" ? -off * 4 : from === "right" ? off * 4 : 0;
  const dy = from === "above" ? -off * 3 : from === "below" ? off * 3 : 0;
  const s = from === "scale" ? interpolate(p, [0, 1], [1.25, 1]) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: interpolate(frame - delay, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${rotate + (1 - p) * 6}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Slow documentary camera: gentle push-in plus drift. Nothing flashy. */
export const Camera: React.FC<{
  duration: number;
  zoom?: [number, number];
  drift?: [number, number];
  origin?: string;
  children: React.ReactNode;
}> = ({ duration, zoom = [1, 1.08], drift = [0, 0], origin = "50% 50%", children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const s = zoom[0] + (zoom[1] - zoom[0]) * t;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: origin,
        transform: `translate(${drift[0] * t}px, ${drift[1] * t}px) scale(${s})`,
      }}
    >
      {children}
    </div>
  );
};

/** Fades a whole scene in and out (plain fades only, per the style rules). */
export const SceneFade: React.FC<{ duration: number; inF?: number; outF?: number; children: React.ReactNode }> = ({
  duration,
  inF = 8,
  outF = 8,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = Math.min(
    interpolate(frame, [0, inF], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [duration - outF, duration], [1, 0], { extrapolateLeft: "clamp" })
  );
  return <div style={{ position: "absolute", inset: 0, opacity: inF === 0 && frame < 1 ? 1 : o }}>{children}</div>;
};

/** 0→1 progress helper for draw-on effects. */
export const useProgress = (delay: number, length: number, ease = Easing.out(Easing.cubic)) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};
