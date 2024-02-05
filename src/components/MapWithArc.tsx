"use client";
import React from "react";
import { LineLayer, ArcLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, ScatterplotLayer } from "@deck.gl/layers/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import { Map } from "react-map-gl";
import { getMapProperties } from "@/service/server/getFile";
// import "ol/ol.css";
// import { Map, View } from "ol";
// import { OSM } from "ol/source";
// import { defaults } from "ol/control";
// import { fromLonLat } from "ol/proj";
// import { Tile } from "ol/layer";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 6,
  pitch: 0,
  bearing: 0,
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
  const [code, setCode] = React.useState(0);
  const base = data[0];

  const pathLayer = new GeoJsonLayer({
    id: "geojson",
    data: path,
    stroked: false,
    filled: false,
    lineWidthMinPixels: 1,
    parameters: {
      depthTest: false,
    },

    // getLineColor: getLineColor,
    // getLineWidth: getLineWidth,

    pickable: true,

    // updateTriggers: {
    //   getLineColor: {year},
    //   getLineWidth: {year}
    // },

    transitions: {
      getLineColor: 1000,
      getLineWidth: 1000,
    },
  });
  const geoJsonLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    filled: true,
    // extruded: true,
    // pointType: "circle",
    lineWidthScale: 10,
    lineWidthMinPixels: 2,
    // getFillColor: [100, 160, 180, 200],
    getFillColor: (d: any) =>
      code === d.properties.sido ? [100, 160, 180, 200] : [255, 255, 255, 0],
    getLineColor: [255, 255, 255],
    getPointRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    onClick: ({ object }) => {
      console.log(object.properties.sido);
      setCode(object.properties.sido);
    },
    updateTriggers: {
      getFillColor: code,
    },
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
    getHeight: 0.7,
    getTilt: 3,
    // getSourcePosition: (d, i) => data[i.index + 1] || data[0],
    getSourcePosition: base,
    getTargetPosition: (d) => d,
    getSourceColor: [255, 255, 255],
    getTargetColor: [0, 128, 255], // 예시 색상: 파란색
    getWidth: 5,
    // 추가적인 설정 (예: 높이, 곡률 등)은 여기에 추가할 수 있습니다.
  });
  const layers = [
    new LineLayer({ id: "line-layer", data }),
    // geoJsonLayer,
    // pathLayer,
    arcLayer,
    // hexagonLayer,
    // scatterLayer,
  ];

  return (
    <>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map
          attributionControl={false}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={mapBoxKey}
        >
          {/* <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <AttributionControl position="bottom-right" />
        <ScaleControl position="bottom-right" /> */}
        </Map>
      </DeckGL>
    </>
  );
}
