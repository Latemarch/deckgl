import StaticMap from "@/components/StaticMap";
import { getMap, getMapProperties } from "@/service/server/getFile";

export default function staticmap() {
  const topoJson = getMap("koreaTopo.json");
  const districtInfo = getMapProperties("staticmapSgg.json");
  return (
    <div>
      <div className="fixed inset-0 bg-[#1B2130]"></div>
      <StaticMap topoJson={topoJson} districtInfo={districtInfo} />
    </div>
  );
}
