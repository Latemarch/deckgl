"use client";
import * as React from "react";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, ArcLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
import { Map } from "react-map-gl";
import { extractTopoLocation } from "@/service/server/topoJsonhandlers";

const mapBoxKey = process.env.NEXT_PUBLIC_MAPBOX_APIKEY;
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
const INITIAL_VIEW_STATE = {
  longitude: 127.1,
  latitude: 37.352,
  zoom: 9,
  pitch: 45,
  bearing: 30,
  minZoom: 8,
  maxZoom: 10,
};

type Props = {
  topoJson: Topology;
  districtInfo: any;
};
export default function ArcWithBase({ topoJson, districtInfo }: Props) {
  const [viewState, setViewState] = React.useState<any>(INITIAL_VIEW_STATE);
  const geoJson = extractTopoLocation("41", topoJson);
  const centers = Object.values(districtInfo)
    .filter((el: any) => el.sido === "41" && !el.adm_cd2)
    .map((v: any) => v.center);
  const base = centers[31];

  const geoJsonLayer = new GeoJsonLayer({
    id: "geoJson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    lineWidthScale: 100,
    getLineWidth: 1,
    getFillColor: [255, 255, 255, 0],
    getLineColor: [255, 255, 255, 80],
    filled: true,
    // opacity: 0,
  });
  const arcLayer = new ArcLayer({
    id: "arcs",
    data: centers,
    getSourcePosition: base,
    getTargetPosition: (d, i) => {
      return d;
    },
    getSourceColor: [253, 247, 0],
    getTargetColor: [62, 168, 174], // 예시 색상: 파란색
    getWidth: 3,
  });
  const layers = [geoJsonLayer, arcLayer].filter(Boolean);
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <Map
        attributionControl={false}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={mapBoxKey}
      />
    </DeckGL>
  );
}
