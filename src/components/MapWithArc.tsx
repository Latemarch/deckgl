"use client";
import React from "react";
import { LineLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Map } from "react-map-gl";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 10,
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
  const layers = [new LineLayer({ id: "line-layer", data })];

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
