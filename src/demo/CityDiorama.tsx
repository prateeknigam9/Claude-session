import React from "react";
import { random } from "remotion";
import { C } from "../theme";
import { Layer } from "../kit";

/** Floating paper-cut city: bright on top, dark "what's underneath" below. */
const GROUND = 590;

const Building: React.FC<{ x: number; w: number; h: number; color: string; win?: string }> = ({ x, w, h, color, win = "rgba(255,255,255,0.55)" }) => {
  const id = `w-${x}-${w}`;
  return (
    <g>
      <defs>
        <pattern id={id} width="34" height="40" patternUnits="userSpaceOnUse" x={x + 10} y={GROUND - h + 18}>
          <rect width="18" height="22" fill={win} />
        </pattern>
      </defs>
      <rect x={x} y={GROUND - h} width={w} height={h} fill={color} />
      <rect x={x + 10} y={GROUND - h + 18} width={w - 20} height={h - 36} fill={`url(#${id})`} />
    </g>
  );
};

const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="#FBFAF6">
    <ellipse cx="0" cy="0" rx="60" ry="26" />
    <ellipse cx="40" cy="-14" rx="40" ry="28" />
    <ellipse cx="-30" cy="-10" rx="34" ry="22" />
  </g>
);

const Tree: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x},${GROUND}) scale(${s})`}>
    <rect x="-5" y="-60" width="10" height="60" fill="#6B4B2E" />
    <circle cx="0" cy="-80" r="38" fill="#2E9A6A" />
    <circle cx="-22" cy="-62" r="24" fill="#2E9A6A" />
    <circle cx="22" cy="-62" r="24" fill="#2E9A6A" />
  </g>
);

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%">{children}</svg>
);

const underside = () => {
  // jagged inverted skyline hanging below the ground line
  let d = `M420,${GROUND} `;
  for (let x = 420; x <= 1500; x += 60) {
    const depth = 120 + random(`u${x}`) * 330;
    d += `L${x},${GROUND + depth} L${x + 40},${GROUND + depth - random(`v${x}`) * 60} `;
  }
  d += `L1500,${GROUND} Z`;
  return d;
};

export const cityLayers: Layer[] = [
  { depth: 0, shadow: 0, node: svg(<><Cloud x={560} y={200} s={0.9} /><Cloud x={1380} y={250} s={1.1} /><Cloud x={980} y={150} s={0.7} /></>) },
  {
    depth: 0.35,
    node: svg(
      <>
        <polygon points={`820,${GROUND} 820,250 845,210 870,250 870,${GROUND}`} fill={C.navy} />
        <Building x={760} w={120} h={330} color={C.navy} />
        <Building x={900} w={150} h={470} color="#F2F0EA" win="rgba(31,46,68,0.35)" />
        <Building x={1060} w={130} h={400} color={C.red} />
        <Building x={1200} w={120} h={280} color="#5B5E86" />
      </>
    ),
  },
  {
    depth: 0.6,
    node: svg(
      <>
        <path d={underside()} fill="#2C2A45" />
        <path d={`M700,${GROUND + 40} l40,120 l-20,90 M1100,${GROUND + 30} l-30,150 l40,80`} stroke="#7FB7BE" strokeWidth="6" fill="none" opacity="0.7" />
        <Building x={560} w={170} h={200} color="#F2F0EA" win="rgba(31,46,68,0.3)" />
        <Building x={1320} w={160} h={210} color={C.mustard} />
      </>
    ),
  },
  {
    depth: 1,
    node: svg(
      <>
        <rect x={400} y={GROUND} width={1120} height={14} fill="#242238" />
        <polygon points={`470,${GROUND} 470,${GROUND - 90} 520,${GROUND - 135} 570,${GROUND - 90} 570,${GROUND}`} fill={C.mustard} />
        <Tree x={455} s={0.9} />
        <Tree x={760} s={0.8} />
        <Tree x={1290} s={1} />
        <Tree x={1460} s={0.85} />
      </>
    ),
  },
];
