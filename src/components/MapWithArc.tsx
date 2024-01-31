"use client";
import React from "react";
import { LineLayer, ArcLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Map } from "react-map-gl";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 7,
  pitch: 0,
  bearing: 0,
};
const mapBoxKey = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [126.99189297042933, 37.55209372016461],
    targetPosition: [126.99189297042933, 37.25],
  },
];

// DeckGL react component
export default function MapWithArc() {
  const arcLayer = new ArcLayer({
    id: "arc-layer",
    data,
    getSourcePosition: (d) => d.sourcePosition,
    getTargetPosition: (d) => d.targetPosition,
    getSourceColor: [0, 128, 255], // 예시 색상: 파란색
    getTargetColor: [255, 0, 128], // 예시 색상: 분홍색
    getWidth: 5, // 선의 굵기
    // 추가적인 설정 (예: 높이, 곡률 등)은 여기에 추가할 수 있습니다.
  });
  const layers = [new LineLayer({ id: "line-layer", data }), arcLayer];
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        attributionControl={false}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={mapBoxKey}
      >
        {/* <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <AttributionControl position="bottom-right" />
        <ScaleControl position="bottom-right" /> */}
      </Map>
    </DeckGL>
  );
}
