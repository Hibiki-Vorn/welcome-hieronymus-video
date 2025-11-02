import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Title: React.FC<{
  readonly titleText: string;
  readonly titleColor: string;
}> = ({ titleText, titleColor }) => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();
  let deg = 0
  const words = titleText.split(" ");

  if (frame > 200) {
    deg = 45
  }

  return (
    <h1 style={{
      fontWeight: "bold",
      fontSize: 100,
      textAlign: "center",
      position: "absolute",
      bottom: 160,
      width: "100%",
    }}>
      {words.map((t, i) => {
        const delay = i * 5;
        let trandform = ""
        const scale = spring({
          fps: videoConfig.fps,
          frame: frame - delay,
          config: {
            damping: 200,
          },
        });
        if (frame > 200) {
          trandform = `scale(${scale}) /*skew(${0.2 * deg}deg, ${deg}deg)*/ rotateX(${((9 * frame) % 360) * ((-1) ^ i)}deg)`
        }
        if (frame < 50) {
          return <></>
        }
        return (
          <span
            key={t}
            style={{
              marginLeft: 10,
              marginRight: 10,
              color: titleColor,
              display: "inline-block",
              transform: trandform,
            }}
          >
            {t}
          </span>
        );
      })}
    </h1>
  );
};
