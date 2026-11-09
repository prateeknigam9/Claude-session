import React from "react";
import { Composition } from "remotion";
import { FPS, H, W, sec } from "./theme";
import { VoxDemo } from "./demo/VoxDemo";
import { TOTAL_SECONDS } from "./demo/script";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="VoxDemo" component={VoxDemo} durationInFrames={sec(TOTAL_SECONDS)} fps={FPS} width={W} height={H} />
  </>
);
