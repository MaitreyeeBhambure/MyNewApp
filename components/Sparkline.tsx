import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";

type Props = {
  data: number[];
  width?: number;
  height?: number;
};

export const Sparkline = ({ data, width = 300, height = 80 }: Props) => {
 const points = useMemo(() => {
  if (!data || data.length < 2) return "";

  const clean = data.filter(
    (v) => typeof v === "number" && isFinite(v)
  );

  if (clean.length < 2) return "";

  const min = Math.min(...clean);
  const max = Math.max(...clean);

  const range = max - min;

  return clean
    .map((value, index) => {
      const safe = isFinite(value) ? value : min;

      const x = (index / (clean.length - 1)) * width;

      const y =
        range === 0
          ? height / 2
          : height - ((safe - min) / range) * height;

      return `${x},${y}`;
    })
    .join(" ");
}, [data]);

  return (
    <View>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};