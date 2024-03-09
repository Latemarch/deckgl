import { Feature } from "geojson";

function moveTextNorth(
  districtInfo: any,
  selectedCity: string,
  deltaLatitude: number,
  deltalongitude: number
) {
  return districtInfo.map((el: any) => {
    if (el.sgg === selectedCity) {
      return {
        ...el,
        center: [el.center[0] + deltalongitude, el.center[1] + deltaLatitude],
      };
    } else return el;
  });
}

function moveFeatureNorth(
  feature: Feature,
  deltaLatitude: number,
  deltalongitude: number
): Feature {
  // const deltaLatitude = 0.01; // 위도를 얼마나 올릴지 결정하는 값
  // const deltalongitude = -0.01;
  if (
    feature.geometry.type === "Polygon" ||
    feature.geometry.type === "MultiPolygon"
  ) {
    const newGeometry = feature.geometry.coordinates.map((polygon) =>
      polygon.map((ring: any) =>
        ring.map(([longitude, latitude]: any) => [
          longitude + deltalongitude,
          latitude + deltaLatitude,
        ])
      )
    );
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: newGeometry,
      },
    };
  }
  return feature; // Polygon이나 MultiPolygon이 아닌 경우 변화 없이 반환
}

export function animateFeatureNorth(feature: Feature, setter: any) {
  let rafId;
  let step = 0;
  const animate = () => {
    step += 1;
    const movedFeature = moveFeatureNorth(feature, 0.001 * step, 0);
    setter(movedFeature);
    rafId = requestAnimationFrame(animate);
    if (step > 10) {
      cancelAnimationFrame(rafId);
    }
  };
  requestAnimationFrame(animate);
}
export function animateTextNorth(
  districtInfo: any,
  selectedCity: string,
  setter: any
) {
  let rafId;
  let step = 0;
  const animate = () => {
    step += 1;
    const movedText = moveTextNorth(
      districtInfo,
      selectedCity,
      0.001 * step,
      0
    );
    setter(movedText);
    rafId = requestAnimationFrame(animate);
    if (step > 10) {
      cancelAnimationFrame(rafId);
    }
  };
  requestAnimationFrame(animate);
}
