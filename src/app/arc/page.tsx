import DashboardMap from "@/components/DashboardMap";
import MapWithArc from "@/components/MapWithArc";
import VworldMap from "@/components/VworldMap";
import { convertToGeoJSON } from "@/service/server/convert";
import {
  getMap,
  getMapProperties,
  getPath,
  saveJson,
} from "@/service/server/getFile";

export default function page() {
  const mapInfo = getMapProperties("sidoInfo.json");
  const geoJson = getMap("sidoKorea.json");
  const path = getPath("roadgeo.json");
  const data = Object.values(mapInfo).map((v: any) => v.center);
  const districtInfo = getMapProperties("districtInfo.json");
  const topoJson = getMap("koreaTopo.json");

  return (
    <div className="w-full h-full flex ">
      <DashboardMap {...{ topoJson, districtInfo }} />
      {/* <MapWithArc {...{ data, path, geoJson }} /> */}
      {/* <VworldMap /> */}
    </div>
  );
}
