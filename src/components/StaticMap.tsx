"use client";
import React from "react";
import DeckGL from "@deck.gl/react/typed";
import { Map } from "react-map-gl";
import { ArcLayer } from "@deck.gl/layers/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { extractTopoLocation } from "@/service/server/topoJsonhandlers";
import hexToRgb from "@/service/client/hexToRgb";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 127.1,
  latitude: 37.552,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

type Props = {
  topoJson: Topology;
};
export default function StaticMap({ topoJson }: Props) {
  const [hoveredCity, setHoveredCity] = React.useState(null);
  const [feature, setFeature] = React.useState(null);
  const geoJson = extractTopoLocation("41", topoJson);
  React.useMemo(() => {
    const f = getGeoJsonFeature(hoveredCity, geoJson);
    if (!f) return;
    console.log("useMemo");
    animateFeatureNorth(f, setFeature);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredCity]);

  const geoJsonLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    filled: true,
    lineWidthScale: 100,
    getFillColor: (d: Feature) => {
      if (d.properties?.sgg === hoveredCity) return hexToRgb("#1B2130", 1);
      // return hexToRgbWithOpacity("#A0E2FF", 0.4);
      return [81, 110, 131];
    },
    getLineColor: hexToRgb("#1B2130", 1),
    getLineWidth: 5,
    onClick: ({ object }) => {
      if (!object) return;
      setHoveredCity(object.properties.sgg);
    },
    // transitions: {
    // getFillColor: 500, // 색상 변화에 대한 애니메이션 지속 시간을 밀리초 단위로 설정
    // },
  });
  const floatedGeoJsonLayer =
    feature &&
    new GeoJsonLayer({
      id: "hovered-city",
      data: [feature],
      pickable: true,
      stroked: true,
      filled: true,
      getFillColor: hexToRgb("#F7A600", 1),
      getFillLine: hexToRgb("#ffffff", 1),
      transitions: {
        getFillColor: 500, // 색상 변화에 대한 애니메이션 지속 시간을 밀리초 단위로 설정
      },
    });

  const layers = [geoJsonLayer, floatedGeoJsonLayer].filter(Boolean);
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={false}
      layers={layers}
    />
  );
}

function getGeoJsonFeature(
  hoveredCity: string | null,
  geoJson: FeatureCollection
): Feature | null {
  if (!hoveredCity) return null;
  const selectedFeature: Feature[] = geoJson.features.filter(
    (f: Feature) => f.properties?.sgg === hoveredCity
  );

  return moveFeatureNorth(selectedFeature[0], 0.01, 0.01);
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
          longitude, // + deltalongitude,
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

function animateFeatureNorth(feature: Feature, setter: any) {
  let rafId;
  let step = 1;
  const animate = (timestamp: number) => {
    step += 1;
    const movedFeature = moveFeatureNorth(feature, 0.001 * step, -0.001 * step);
    setter(movedFeature);
    rafId = requestAnimationFrame(animate);
    if (step > 10) {
      cancelAnimationFrame(rafId);
    }
  };
  requestAnimationFrame(animate);
}
