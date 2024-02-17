import { GeometryObject, Topology } from "topojson-specification";
import { feature, merge } from "topojson-client";
import { FeatureCollection, Geometry } from "geojson";
export function getSggScaleSidoGeoJson(
  topoJson: any,
  regionCode: string
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

  Object.entries(groupedBySgg).forEach(([sgg, val]: any) => {
    // 각 'sgg' 그룹에 대해 병합 실행
    const geometries = groupedBySgg[sgg].map((g: any) => g);
    const merged = merge(topoJson, geometries);

    // 병합된 지오메트리를 배열에 추가
    const { sgg: sggCd, sggnm: sggNm } = val[0].properties;
    mergedGeometries.push({
      type: "Feature",
      geometry: merged,
      properties: {
        sggCd,
        sggNm,
      },
    });
  });

  // GeoJSON FeatureCollection 생성
  const geojson: FeatureCollection = {
    type: "FeatureCollection",
    features: mergedGeometries,
  };

  return geojson;
}
