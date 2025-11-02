import { spring } from "remotion";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Title } from "./HelloWorld/Title";
import { z } from "zod";
import { SvgFlyIn } from "./SvgFlyIn";

const fillColor = require("./colors.json")

console.log(fillColor)

export const myCompSchema = z.object({
});

export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const colorIndex = Math.floor(
    interpolate(frame, [0, 600], [0, fillColor.length - 1], { extrapolateRight: "clamp" })
  );

  // Animate from 0 to 1 after 25 frames
  const logoTranslationProgress = spring({
    frame: frame - 25,
    fps,
    config: {
      damping: 100,
    },
  });

  // Move the logo up by 150 pixels once the transition starts
  const logoTranslation = interpolate(
    logoTranslationProgress,
    [0, 1],
    [0, -150],
  );

  // Fade out the animation at the end
  const opacity = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames - 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ opacity }}>
        <AbsoluteFill style={{
          transform: `translateY(${logoTranslation}px)`,
        }}>
          <SvgFlyIn color={fillColor[colorIndex]} />
        </AbsoluteFill>
        {/* Sequences can shift the time for its children! */}
        <Sequence from={35}>
          <Title titleText="Welcome to Hieronymus" titleColor={fillColor[colorIndex]} />
        </Sequence>
        {/* The subtitle will only enter on the 75th frame. */}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
