import DashboardMap from "@/components/DashboardMap";
import { getMap, getMapProperties } from "@/service/server/getFile";

export default function Home() {
  const districtInfo = getMapProperties("districtInfo.json");
  const topoJson = getMap("koreaTopo.json");

  return (
    <div className="w-full h-full flex bg-blue-200">
      <DashboardMap {...{ topoJson, districtInfo }} />
    </div>
  );
}
