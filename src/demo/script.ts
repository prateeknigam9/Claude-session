import { Cue } from "../kit";

/**
 * The script drives everything: scene boundaries (seconds) and subtitle cues.
 * Replace with real narration + ElevenLabs word timings for a real episode.
 * DEMO CONTENT IS FICTIONAL — "Vertex Infra" is a made-up company.
 */
export const SCENES = {
  disclaimer: [0, 3],
  coldOpen: [3, 10],
  title: [10, 14],
  chapter1: [14, 16.5],
  auditor: [16.5, 25],
  portrait: [25, 31],
  board: [31, 37],
  map: [37, 41],
  number: [41, 45],
  quote: [45, 50.5],
  end: [50.5, 54],
} as const;

export const TOTAL_SECONDS = 54;

export const CUES: Cue[] = [
  { start: 3.2, end: 6.4, text: "On paper, Vertex Infra was the safest company in the country." },
  { start: 6.4, end: 9.8, text: "Underneath, almost nothing held it up." },
  { start: 16.8, end: 20.5, text: "Every quarter, the auditors saw the same line: cash at bank." },
  { start: 20.5, end: 24.8, text: "They signed it. The cash, it turned out, did not exist." },
  { start: 25.2, end: 28.2, text: "The chairman called the gap “a timing difference.”" },
  { start: 28.2, end: 30.8, text: "According to the regulator, it was something else." },
  { start: 31.2, end: 34, text: "Three banks. Two auditors. One signature on every page." },
  { start: 34, end: 36.8, text: "Each saw a piece. Nobody saw the board." },
  { start: 37.2, end: 40.8, text: "The money moved through four cities in eleven days." },
  { start: 41.2, end: 44.8, text: "Ninety-four percent of the reported cash was fictitious." },
  { start: 45.2, end: 50.2, text: "“We were shown the documents. We had no reason to doubt them.”" },
  { start: 50.8, end: 53.8, text: "They saw it. Too late." },
];
