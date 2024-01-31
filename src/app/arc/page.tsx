import MapWithArc from "@/components/MapWithArc";
import { getMap, getMapProperties } from "@/service/server/getFile";

export default function page() {
  const mapInfo = getMapProperties("sidoInfo.json");
  const map = getMap("sidoKorea.json");
  const data = Object.values(mapInfo).map((v: any) => v.center);
  console.log(data);

  return (
    <div className="w-full h-full flex ">
      <MapWithArc data={data} geoJson={map} />
    </div>
  );
}
