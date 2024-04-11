"use client";
import * as React from "react";
import * as d3 from "d3";

interface Props {
  data?: any;
  height?: number;
  width?: number;
}
export default function TimeBar({ width, height }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    d3.select(ref.current).selectAll("svg").remove();

    const svg = d3.select(ref.current).append("svg");
  }, []);

  return <div ref={ref}></div>;
}
