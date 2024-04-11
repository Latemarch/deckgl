"use client";
import * as React from "react";
import D3Slider from "./D3Slider";

export default function SliderContainer() {
  const [sliderPoint, setSliderPoint] = React.useState(0);
  return (
    <div className="w-1/2 h-4">
      <D3Slider
        range={72}
        sliderPoint={sliderPoint}
        setSliderPoint={setSliderPoint}
      />
    </div>
  );
}
