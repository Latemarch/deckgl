export function convertToGeoJSON(data: any) {
  // 노선별로 데이터 그룹화
  const groupedByRoute = data.reduce((acc: any, item: any) => {
    const route = item["노선번호"];
    if (!acc[route]) {
      acc[route] = [];
    }
    acc[route].push([item["Y좌표값"], item["X좌표값"]]);
    return acc;
  }, {});

  // GeoJSON 형식으로 변환
  const geoJson = {
    type: "FeatureCollection",
    features: Object.entries(groupedByRoute).map(
      ([routeNumber, coordinates]) => {
        // 노선번호에 해당하는 첫 번째 항목 찾기
        const routeData = data.find(
          (item: any) => item["노선번호"] === routeNumber
        );
        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates,
          },
          properties: {
            name: routeData ? routeData["도로명"] : "Unknown", // 항목이 없는 경우 'Unknown' 사용
            id: routeNumber,
          },
        };
      }
    ),
  };

  return geoJson;
}
