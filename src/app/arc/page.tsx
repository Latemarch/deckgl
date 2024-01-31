import MapWithArc from "@/components/MapWithArc";
import { getMap, getMapProperties, getPath } from "@/service/server/getFile";

export default function page() {
  const mapInfo = getMapProperties("districtInfo.json");
  const geoJson = getMap("sidoKorea.json");
  const path = getPath("road.json");
  const data = Object.values(mapInfo).map((v: any) => v.center);

  return (
    <div className="w-full h-full flex ">
      <MapWithArc {...{ data, path, geoJson }} />
    </div>
  );
}
