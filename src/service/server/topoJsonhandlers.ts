import * as d3 from "d3";
import * as topojson from "topojson-client";
import {
  Feature,
  FeatureCollection,
  MultiLineString,
  MultiPolygon,
} from "geojson";
import { Topology, GeometryObject } from "topojson-specification";
import { getMap } from "./getFile";
import { feature, merge } from "topojson-client";

// const topoJson = getMap("koreaTopo.json");

export function extractTopoLocation(
  regionCode: string,
  topoJson: any
): FeatureCollection {
  const geometries = topoJson.objects["jjh"].geometries;

  // 'sido' 기준으로 필터링
  const filteredGeometries = geometries.filter(
    (geometry: any) => geometry.properties["sido"] === regionCode
  );

  // 'sgg' 값을 기준으로 그룹화
  const groupedBySgg = filteredGeometries.reduce((acc: any, geometry: any) => {
    const sgg = geometry.properties["sgg"];
    if (!acc[sgg]) {
      acc[sgg] = [];
    }
    acc[sgg].push(geometry);
    return acc;
  }, {});

  // 병합된 지오메트리를 저장할 배열
  const mergedGeometries: any = [];

  Object.keys(groupedBySgg).forEach((sgg) => {
    // 각 'sgg' 그룹에 대해 병합 실행
    const geometries = groupedBySgg[sgg].map((g: any) => g);
    const merged = merge(topoJson, geometries);

    // 병합된 지오메트리를 배열에 추가
    mergedGeometries.push({
      type: "Feature",
      geometry: merged,
      properties: {
        // 필요한 속성 설정
        sgg: sgg,
      },
    });
  });

  // GeoJSON FeatureCollection 생성
  const geojson = {
    type: "FeatureCollection",
    features: mergedGeometries,
  } as FeatureCollection;

  return geojson;
}
