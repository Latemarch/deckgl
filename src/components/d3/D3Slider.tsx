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
  const quantizeScale = d3
    .scaleQuantize()
    .domain([0, width])
    .range(d3.range(0, range + 0.1, 1));

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
            dragElements(leftTick);
            return leftTick;
          } else {
            const leftTick =
              Math.floor(currentSliderPoint / tickInterval) * tickInterval;
            dragElements(leftTick);
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
            const rightTick = currentSliderPoint + tickInterval;
            dragElements(rightTick);
            return rightTick;
          } else {
            const rightTick =
              Math.ceil(currentSliderPoint / tickInterval) * tickInterval;
            dragElements(rightTick);
            return rightTick;
          }
        });
      });

    const circlePoint = barGroup
      .append("circle")
      .attr("cx", xScale(sliderPoint))
      .attr("cy", 4)
      .attr("r", 6)
      .attr("stroke", "white")
      .attr("stroke-width", "1")
      .attr("fill", customColors.success);

    const tooltipGroup = barGroup
      .append("g")
      .attr("transform", `translate(${xScale(sliderPoint) - 22},-28)`);
    tooltipGroup
      .append("image")
      .attr("href", "images/tooltipBubble.svg")
      .attr("width", 44)
      .attr("height", 30);
    const tooltipText = tooltipGroup
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12")
      .attr("x", 22)
      .attr("y", 16)
      .attr("style", "user-select: none;")
      .text(sliderPoint);

    const drag = d3.drag<SVGCircleElement, unknown>().on("drag", dragging);
    circlePoint.call(drag);

    function dragging(
      this: SVGGElement,
      e: d3.D3DragEvent<SVGGElement, number, number>
    ) {
      const quantizedVale = quantizeScale(e.x);
      dragElements(quantizedVale);
      setSliderPoint(quantizedVale);
    }

    function dragElements(newX: number) {
      circlePoint.attr("cx", xScale(newX));
      tooltipGroup.attr("transform", `translate(${xScale(newX) - 22},-28)`);
      tooltipText.text(newX);
    }

    return function cleanup() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      d3.select(ref.current).selectAll("svg").remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ref}></div>;
}
