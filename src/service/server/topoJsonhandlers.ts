import * as d3 from "d3";
import * as topojson from "topojson-client";
import { MultiLineString, MultiPolygon } from "geojson";
import { Topology, GeometryObject } from "topojson-specification";
import { getMap } from "./getFile";

const topoJson = getMap("koreaTopo.json");

export function extractTopoLocation(regionCode: string) {
  const geometries = topoJson.objects["jjh"].geometries;
  console.log(geometries[0]);
  const regionGeometries = geometries.filter(
    (geometry: any) =>
      geometry.properties[regionCode.length > 2 ? "sgg" : "sido"] === regionCode
  );
  return {
    type: "GeometryCollection",
    geometries: regionGeometries,
  };
}
