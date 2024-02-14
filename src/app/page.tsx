import JSDeck from "@/components/JSDeck";
import MapWithArc from "@/components/MapWithArc";
import VworldMap from "@/components/VworldMap";
import { getMap, getMapProperties, getPath } from "@/service/server/getFile";

export default function Home() {
  const mapInfo = getMapProperties("sidoInfo.json");
  const geoJson = getMap("sidoKorea.json");
  const path = getPath("roadgeo.json");
  const data = Object.values(mapInfo).map((v: any) => v.center);
  // const pathgeo = convertToGeoJSON(path);
  // saveJson(pathgeo);
  //https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/highway/roads.json

  return (
    <div className="w-full h-full flex bg-blue-200">
      {/* <MapWithArc {...{ data, path, geoJson }} /> */}
      <JSDeck {...{ data, path, geoJson }} />

      {/* <VworldMap /> */}
    </div>
  );
}
