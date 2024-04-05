"use client";
import * as React from "react";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, ArcLayer, TextLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
import { StaticMap } from "react-map-gl";
import { extractTopoLocation } from "@/service/client/topoJsonHandler";
import { FeatureCollection } from "geojson";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";
const INITIAL_VIEW_STATE = {
  longitude: 127.1,
  latitude: 37.352,
  zoom: 9,
  pitch: 45,
  bearing: 30,
  // minZoom: 8,
  // maxZoom: 10,
};

type Props = {
  geoJson: FeatureCollection;
  topoJson?: Topology;
  districtInfo?: any;
  textInfo?: any;
};
export default function BaseMap({ geoJson, districtInfo, textInfo }: Props) {
  // const centers = Object.values(districtInfo)
  //   .filter((el: any) => el.sido === "41" && !el.adm_cd2)
  //   .map((v: any) => v.center);
  // const base = centers[31];

  const geoJsonLayer = new GeoJsonLayer({
    id: "geoJson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    lineWidthScale: 100,
    getLineWidth: 5,
    getFillColor: [255, 255, 255, 0],
    getLineColor: [255, 255, 255, 80],
    filled: true,
    // opacity: 0,
  });

  const layers = [geoJsonLayer].filter(Boolean);
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      {/* <StaticMap mapStyle={MAP_STYLE} /> */}
    </DeckGL>
  );
}
