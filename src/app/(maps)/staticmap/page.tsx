import StaticMap from "@/components/StaticMap";
import { getMap } from "@/service/server/getFile";

export default function staticmap() {
  const topoJson = getMap("koreaTopo.json");
  return (
    <div>
      <div className="fixed inset-0 bg-[#1B2130]"></div>
      <StaticMap topoJson={topoJson} />
    </div>
  );
}
