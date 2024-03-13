"use client";
import * as React from "react";
import * as d3 from "d3";
import { customColors } from "@/colors";

interface Props {
  height?: number;
  width?: number;
  range: number;
  sliderPoint: number;
  setSliderPoint: React.Dispatch<React.SetStateAction<number>>;
}
export default function D3Slider({
  width = 400,
  height = 60,
  range = 72,
  sliderPoint,
  setSliderPoint,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const svg = d3
      .select(ref.current)
      .append("svg")
      // .attr("width", width + 80)
      // .attr("height", height + 30)
      .attr("viewBox", `0 0 ${width + 80} ${height}`)
      .style("border", "1px solid steelblue");

    const tickInterval = (range - (range % 5)) / 5;
    const tickValues = d3.range(0, range + tickInterval, tickInterval);
    const xScale = d3.scaleLinear([0, range], [0, width]);
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat((d) => d.toString());

    const xAxisG = svg
      .append("g")
      .attr("transform", `translate(40,${height / 2 + 10})`)
      .call(xAxis);
    // xAxisG.selectAll("line").style("stroke", "none");
    xAxisG.selectAll("path").style("stroke", "none");
    xAxisG.selectAll("text").attr("fill", "black");

    const barGroup = svg
      .append("g")
      .attr("transform", `translate(40, ${height / 2})`);

    //Group which contains all elements to make Slider
    barGroup
      .append("rect")
      .attr("width", xScale(range))
      .attr("height", 8)
      .attr("fill", customColors.success);

    barGroup
      .selectAll(".boundaryCircle")
      .data([0, range])
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d))
      .attr("cy", 4)
      .attr("r", 4)
      .attr("fill", customColors.success);

    //Buttons
    barGroup
      .append("image")
      .attr("href", "images/sliderButtonLeft.svg")
      .attr("width", 30)
      .attr("height", 30)
      .attr("x", -40)
      .attr("y", -10) // 이미지의 y 위치 조정
      .on("click", () => {
        setSliderPoint((currentSliderPoint) => {
          if (
            currentSliderPoint % tickInterval === 0 &&
            currentSliderPoint !== 0
          ) {
            const leftTick = currentSliderPoint - tickInterval;
            circlePoint.attr("cx", xScale(leftTick));
            return leftTick;
          } else {
            const leftTick =
              Math.floor(currentSliderPoint / tickInterval) * tickInterval;
            circlePoint.attr("cx", xScale(leftTick));
            return leftTick;
          }
        });
      });

    barGroup
      .append("image")
      .attr("href", "images/sliderButtonLeft.svg")
      .attr("width", 30)
      .attr("height", 30)
      .attr("x", width + 10)
      .attr("y", -10)
      .attr("transform", "rotate(180, " + (width + 25) + ", 5)")
      .on("click", () => {
        setSliderPoint((currentSliderPoint) => {
          if (
            currentSliderPoint % tickInterval === 0 &&
            currentSliderPoint !== range - (range % 5)
          ) {
            const leftTick = currentSliderPoint + tickInterval;
            circlePoint.attr("cx", xScale(leftTick));
            return leftTick;
          } else {
            const leftTick =
              Math.ceil(currentSliderPoint / tickInterval) * tickInterval;
            circlePoint.attr("cx", xScale(leftTick));
            return leftTick;
          }
        });
      });

    const circleGroup = barGroup
      .append("g")
      .selectAll(".dataCircle")
      .data([sliderPoint]);

    const circlePoint = circleGroup
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d))
      .attr("cy", 4)
      .attr("r", 6)
      .attr("stroke", "white")
      .attr("stroke-width", "1")
      .attr("fill", customColors.success);

    circleGroup
      .enter()
      .append("image")
      .attr("x", (d) => xScale(d))
      .attr("y", 20)
      .attr("href", "images/tooltipBubble.svg")
      .attr("width", 30)
      .attr("height", 30);
    // .attr("x", ));
    const drag = d3
      .drag<SVGCircleElement, number, number>()
      .on("drag", dragging);

    circlePoint.call(drag);

    function dragging(
      this: SVGGElement,
      e: d3.D3DragEvent<SVGGElement, number, number>
    ) {
      const quantizeScale = d3
        .scaleQuantize()
        .domain([0, width])
        .range(d3.range(0, range + 0.1, 1));
      const quantizedVale = quantizeScale(e.x);
      circlePoint.attr("cx", xScale(quantizedVale));
      setSliderPoint(quantizedVale);
    }

    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      d3.select(ref.current).selectAll("svg").remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}
