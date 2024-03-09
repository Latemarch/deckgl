import ArcWithBase from "@/components/ArcWithBase";
import DashboardMap from "@/components/DashboardMap";
import MapWithArc from "@/components/MapWithArc";
import VworldMap from "@/components/VworldMap";
import { convertToGeoJSON } from "@/service/server/convert";
import { getMap, getMapProperties } from "@/service/server/getFile";

export default function page() {
  const districtInfo = getMapProperties("districtInfo.json");
  const topoJson = getMap("koreaTopo.json");

  return (
    <div className="fixed inset-0 overflow-hidden">
      <ArcWithBase {...{ topoJson, districtInfo }} />
    </div>
  );
}
