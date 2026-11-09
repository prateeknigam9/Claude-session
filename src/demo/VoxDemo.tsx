import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C, F, sec } from "../theme";
import {
  AuditorView, BigNumber, Camera, CaseBoard, ChapterCard, DateStamp, DisclaimerCard, DocScrap, Drop, Grain,
  HalftonePhoto, HonestyTag, LabelTag, MapRoute, MarkerArrow, MarkerCircle, MarkerX, MeasureMark, NameLabel,
  PaperBackground, PaperDiorama, QuoteCard, RansomTitle, SceneFade, Stamp, Stripes, Subtitles, Tape, TwoStepPills,
} from "../kit";
import { cityLayers } from "./CityDiorama";
import { CUES, SCENES } from "./script";

const Scene: React.FC<{ at: readonly [number, number]; fade?: boolean; children: (d: number) => React.ReactNode }> = ({ at, fade = true, children }) => {
  const d = sec(at[1] - at[0]);
  return (
    <Sequence from={sec(at[0])} durationInFrames={d}>
      {fade ? <SceneFade duration={d}>{children(d)}</SceneFade> : children(d)}
    </Sequence>
  );
};

export const VoxDemo: React.FC = () => (
  <AbsoluteFill style={{ background: "#0E0E0D" }}>
    <Scene at={SCENES.disclaimer}>
      {() => <DisclaimerCard text="A fictional demo of the Vox-kit templates. Names, numbers and events are invented. Disputed claims are attributed." />}
    </Scene>

    {/* COLD OPEN: the collapse, as a paper-cut diorama */}
    <Scene at={SCENES.coldOpen}>
      {(d) => (
        <>
          <PaperDiorama layers={cityLayers} duration={d} bg={C.teal} />
          <DateStamp text="14 MAR 2009 · 9:12 AM" place="Mumbai" delay={8} />
          <LabelTag text="ON PAPER: SAFE" x={1250} y={210} delay={sec(1.4)} rotate={-2} />
          <LabelTag text="UNDERNEATH?" x={1180} y={800} delay={sec(3.6)} accent rotate={2} />
          <HonestyTag text="Illustration" x={1640} y={70} />
        </>
      )}
    </Scene>

    <Scene at={SCENES.title}>
      {() => (
        <PaperBackground color={C.slate}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <RansomTitle text="THE LEDGER THAT LIED" delay={6} size={140} />
          </AbsoluteFill>
          <MeasureMark x={180} y={160} length={1560} delay={30} />
          <MeasureMark x={180} y={920} length={1560} delay={36} />
        </PaperBackground>
      )}
    </Scene>

    <Scene at={SCENES.chapter1} fade={false}>{() => <ChapterCard index={1} title="The Books" />}</Scene>

    {/* MOTIF: "what the auditors saw" */}
    <Scene at={SCENES.auditor}>
      {(d) => (
        <Camera duration={d} zoom={[1, 1.06]} origin="55% 45%">
          <AuditorView
            title="BALANCE SHEET · Q3 FY09"
            stamp="VERTEX INFRA LTD."
            highlightRow={2}
            highlightDelay={sec(1.6)}
            rows={[
              { label: "Revenue", value: "₹ 2,112 Cr" },
              { label: "Debtors", value: "₹ 490 Cr" },
              { label: "Cash at bank", value: "₹ 5,040 Cr", flag: "NEVER CONFIRMED", flagDelay: sec(4.2) },
              { label: "Interest accrued", value: "₹ 376 Cr", flag: "ALSO FICTITIOUS", flagDelay: sec(5.2) },
              { label: "Liabilities", value: "₹ 1,230 Cr" },
            ]}
          />
          <MarkerCircle x={1110} y={355} w={360} h={110} delay={sec(2.6)} />
          <TwoStepPills context="AUDITOR SIGNED" punch="CASH DIDN'T EXIST" x={520} y={790} delay={sec(4)} />
        </Camera>
      )}
    </Scene>

    {/* COLLAGE PORTRAIT */}
    <Scene at={SCENES.portrait}>
      {(d) => (
        <PaperBackground color="#CFC8BA">
          <Camera duration={d} zoom={[1.02, 1.1]} drift={[-30, 0]}>
            <Drop x={1300} y={90} rotate={3} delay={4}><DocScrap seed="news" width={420} height={560} heading="Regulator widens probe" lines={16} /></Drop>
            <Drop x={540} y={330} rotate={-4} delay={10}><Stripes width={180} height={300} /></Drop>
            <Drop x={720} y={110} delay={0}><HalftonePhoto seed="chair" width={620} height={760} /></Drop>
            <Tape x={860} y={90} rotate={-6} />
            <Stamp x={1500} y={250} text="FILED" sub="12 · 03 · 2009" delay={sec(2)} rotate={12} size={54} />
            <MarkerX x={600} y={190} size={70} delay={sec(1.4)} />
            <MeasureMark x={1250} y={720} length={260} vertical delay={sec(1.8)} />
            <MarkerArrow x={1600} y={820} to={[1260, 640]} note="'timing difference'" delay={sec(3)} />
          </Camera>
          <NameLabel name="R. MEHRA" role="Chairman, Vertex Infra (fictional)" x={120} y={820} delay={sec(0.8)} />
          <LabelTag text="ACCORDING TO THE REGULATOR" x={120} y={60} delay={sec(3.2)} size={30} />
        </PaperBackground>
      )}
    </Scene>

    <Scene at={SCENES.board}>
      {(d) => (
        <Camera duration={d} zoom={[1.04, 1.1]}>
          <CaseBoard
            nodes={[
              { id: "co", x: 790, y: 380, title: "VERTEX INFRA", body: "Reported cash ₹5,040 Cr", delay: 4, kind: "photo", w: 340 },
              { id: "b1", x: 220, y: 140, title: "BANK A", body: "Confirmation letter — forged?", delay: 14 },
              { id: "b2", x: 240, y: 640, title: "BANK B", body: "FDs on letterhead only", delay: 22 },
              { id: "b3", x: 1400, y: 150, title: "BANK C", body: "No record of account", delay: 30 },
              { id: "au", x: 1380, y: 620, title: "AUDITORS", body: "Signed 9 quarters running", delay: 40 },
              { id: "nt", x: 840, y: 90, title: "Who saw the whole board?", delay: 90, kind: "note", w: 300 },
            ]}
            links={[
              { from: "co", to: "b1", delay: 50 },
              { from: "co", to: "b2", delay: 58 },
              { from: "co", to: "b3", delay: 66 },
              { from: "co", to: "au", delay: 74 },
              { from: "au", to: "b3", delay: 100 },
            ]}
          />
        </Camera>
      )}
    </Scene>

    <Scene at={SCENES.map}>
      {() => (
        <>
          <MapRoute
            land="M520,120 C700,80 980,110 1180,180 C1360,240 1460,380 1420,560 C1390,700 1260,860 1060,960 C930,1020 840,1000 800,900 C740,760 640,700 560,600 C470,480 420,300 520,120 Z"
            route="M700,300 C820,360 900,330 1040,300 S1250,420 1180,600 S900,760 960,880"
            routeDelay={10}
            routeFrames={70}
            pins={[
              { x: 700, y: 300, label: "DAY 1", delay: 10 },
              { x: 1040, y: 300, label: "DAY 3", delay: 34 },
              { x: 1180, y: 600, label: "DAY 7", delay: 58 },
              { x: 960, y: 880, label: "DAY 11", delay: 80 },
            ]}
          />
          <HonestyTag text="Not to scale" dark x={1620} y={60} />
        </>
      )}
    </Scene>

    <Scene at={SCENES.number}>
      {() => <BigNumber value={94} suffix="%" label="of reported cash was fictitious" source="ACCORDING TO THE (FICTIONAL) FORENSIC AUDIT" />}
    </Scene>

    <Scene at={SCENES.quote}>
      {(d) => (
        <QuoteCard quote="We were shown the documents. We had no reason to doubt them." who="Audit partner, fictional testimony">
          <PaperDiorama layers={cityLayers} duration={d} bg={C.navy} push={0.05} />
        </QuoteCard>
      )}
    </Scene>

    <Scene at={SCENES.end}>
      {() => (
        <PaperBackground color={C.paper}>
          <Stamp x={960} y={480} text="SEEN, TOO LATE." delay={10} rotate={-6} size={130} />
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 190 }}>
            <div style={{ fontFamily: F.type, fontSize: 28, color: C.inkSoft }}>VOX-KIT · TEMPLATE DEMO</div>
          </AbsoluteFill>
        </PaperBackground>
      )}
    </Scene>

    <Subtitles cues={CUES} />
    <Grain />
  </AbsoluteFill>
);
