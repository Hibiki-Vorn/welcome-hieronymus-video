import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
  AbsoluteFill,
  useVideoConfig,
} from "remotion";

let paths: string[] = require("./logo_path.json");

type SvgFlyInProps = {
  color: string;
};

export const SvgFlyIn: React.FC<SvgFlyInProps> = ({ color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 时间配置（帧数）
  const firstRotateFrames = 0.3 * fps; // 0.3 秒
  const flyInDuration = 20; // 每个 path 飞入持续 20 帧
  const pathGap = 15; // path 间隔 15 帧
  const numPaths = paths.length;
  const flyInTotalFrames =
    flyInDuration + pathGap * (numPaths - 1); // 所有 path 完成飞入总时间
  const accelerateFrames = 0.5 * fps; // 加速旋转 0.5 秒

  // 计算旋转角度
  let rotate = 0;


  if (frame < firstRotateFrames) {
    // 第一步：第一个 path 单独旋转
    rotate = interpolate(frame, [0, firstRotateFrames], [0, 60]); // 300ms 旋转 60 度
  } else if (frame < firstRotateFrames + flyInTotalFrames) {
    // 第二步：四个 path 飞入期间，慢速旋转
    const localFrame = frame - firstRotateFrames;
    rotate = 60 + (localFrame * 30) / flyInTotalFrames; // 飞入期间缓慢旋转 30 度
  } else if (frame < firstRotateFrames + flyInTotalFrames + accelerateFrames + 83) {
    // 第三步：加速旋转
    const localFrame = frame - firstRotateFrames - flyInTotalFrames;
    rotate = 90 + interpolate(localFrame, [0, accelerateFrames], [0, 180]); // 加速旋转 180 度
  } else {
    // 第四步：正常旋转
    const localFrame =
      frame - firstRotateFrames - flyInTotalFrames - accelerateFrames;
    rotate = 270 + (localFrame * 360) / (fps * 3); // 正常旋转速度
  }

  let transform = `rotateZ(${rotate}deg) rotateY(${rotate-90}deg) rotateX(${rotate-90}deg)/**/`

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //backgroundColor: "black",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1365.333 1365.333"
        width={600}
        height={600}
        style={{
          transform: transform,
        }}
      >
        {paths.map((d, i) => {
          const delay = firstRotateFrames + i * pathGap; // 第一个 path 飞入延迟结束旋转
          const progress = interpolate(
            frame,
            [delay, delay + flyInDuration],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const opacity = progress;
          const translateY = interpolate(progress, [0, 1], [80, 0]);
          const scale = interpolate(progress, [0, 1], [0.9, 1]);

          return (
            <g
              key={i}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                transformOrigin: "50% 50%",
              }}
            >
              <path d={d} fill={color} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
