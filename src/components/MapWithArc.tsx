"use client";
import React from "react";
import { LineLayer, ArcLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import { Map } from "react-map-gl";
import { getMapProperties } from "@/service/server/getFile";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 6,
  pitch: 10,
  bearing: 10,
};
const mapBoxKey = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

// Data to be used by the LineLayer
// const data = [
//   {
//     sourcePosition: [126.99189297042933, 37.55209372016461],
//     targetPosition: [126.99189297042933, 37.25],
//   },
// ];

// DeckGL react component
export default function MapWithArc({ data, geoJson, path }: any) {
  const base = data[0];
  const geoJsonLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    filled: true,
    // extruded: true,
    // pointType: "circle",
    lineWidthScale: 20,
    lineWidthMinPixels: 2,
    getFillColor: [100, 160, 180, 200],
    getLineColor: [255, 255, 255],
    getPointRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
  });
  const scatterLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 10,
    radiusMaxPixels: 20,
    lineWidthMinPixels: 100,
    getPosition: (d) => d,
    getRadius: (d, i) => i.index * 100,
    getFillColor: (d) => [255, 140, 0],
    getLineColor: (d) => [0, 0, 0],
  });
  const colorRange: any = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
  ];
  const hexagonLayer = new HexagonLayer({
    id: "hexagon-layer",
    colorRange,
    data,
    pickable: true,
    extruded: true,
    radius: 1000,
    elevationScale: 100,
    getPosition: (d) => d,
    getElevationWeight: (d, i) => i.index * i.index,
  });
  const arcLayer = new ArcLayer({
    id: "arc-layer",
    data,
    // getHeight: 0.7,
    // getTilt: 3,
    getSourcePosition: (d, i) => data[i.index + 1] || data[0],
    getTargetPosition: (d) => d,
    getSourceColor: [0, 128, 255], // 예시 색상: 파란색
    getTargetColor: [255, 0, 128], // 예시 색상: 분홍색
    getWidth: 5, // 선의 굵기
    // 추가적인 설정 (예: 높이, 곡률 등)은 여기에 추가할 수 있습니다.
  });
  const layers = [
    new LineLayer({ id: "line-layer", data }),
    geoJsonLayer,
    // arcLayer,
    // hexagonLayer,
    // scatterLayer,
  ];
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      {/* <Map
        attributionControl={false}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={mapBoxKey}
      > */}
      {/* <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <AttributionControl position="bottom-right" />
        <ScaleControl position="bottom-right" /> */}
      {/* </Map> */}
    </DeckGL>
  );
}
