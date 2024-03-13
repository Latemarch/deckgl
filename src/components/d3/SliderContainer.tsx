"use client";
import * as React from "react";
import D3Slider from "./D3Slider";

export default function SliderContainer() {
  const [sliderPoint, setSliderPoint] = React.useState(0);
  console.log("container", sliderPoint);
  return (
    <div className="w-full h-20">
      <D3Slider
        range={72}
        sliderPoint={sliderPoint}
        setSliderPoint={setSliderPoint}
      />
    </div>
  );
}
