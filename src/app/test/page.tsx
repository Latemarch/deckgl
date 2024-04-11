import D3Slider from "@/components/d3/D3Slider";
import SliderContainer from "@/components/d3/SliderContainer";
import TimeBarContainer from "@/components/d3/TimeBarContainer";

export default function page() {
  return (
    <div className="w-[500px] flex justify-center p-10 h-52 bg-red-300">
      {/* <SliderContainer /> */}
      <TimeBarContainer />
    </div>
  );
}
