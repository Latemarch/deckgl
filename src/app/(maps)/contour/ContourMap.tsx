"use client";
import * as React from "react";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
//@ts-ignore
import { ContourLayer } from "@deck.gl/aggregation-layers";
import { extractTopoLocation } from "@/service/client/topoJsonHandler";
import { StaticMap } from "react-map-gl";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: 127.0,
  latitude: 37.302,
  zoom: 11,
  pitch: 45,
  bearing: 30,
  minZoom: 7.5,
  // maxZoom: 10,
};

type Props = {
  topoJson: Topology;
  districtInfo: any;
  textInfo: any;
  data: any;
};
export default function ContourMap({
  topoJson,
  textInfo,
  districtInfo,
  data,
}: Props) {
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
  const gridLayer = new ContourLayer({
    id: "grid",
    data,
    opacity: 0.8,
    pickable: true,
    extruded: true,
    contours: [
      { threshold: 1, color: [255, 0, 0], strokeWidth: 4 },
      { threshold: 5, color: [0, 255, 0], strokeWidth: 2 },
      { threshold: [6, 10], color: [0, 0, 255, 128] },
    ],
    elevationScale: 4,
    // getPosition: (d: any) => [+d.dest_CENTER_X, +d.dest_CENTER_Y],
    getPosition: (d: any) => [+d.dest_CENTER_X, +d.dest_CENTER_Y],
    getWeight: (d: any) => +d.counts,
  });
  // const arcLayer = new ArcLayer({
  //   id: "arcs",
  //   data: centers,
  //   getSourcePosition: base,
  //   getTargetPosition: (d, i) => {
  //     return d;
  //   },
  //   getSourceColor: [253, 247, 0],
  //   getTargetColor: [62, 168, 174], // 예시 색상: 파란색
  //   getWidth: 3,
  // });

  const textLayer = new TextLayer({
    id: "text-layer",
    data: textInfo,
    pickable: false,
    getColor: [255, 255, 255],
    billboard: false,
    getPosition: (d) => [d.center[0], d.center[1] - 0.01],
    getText: (d) => d.sggnm,
    getSize: 24,
    getAngle: 0,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center",
    characterSet: "auto",
  });
  const layers = [geoJsonLayer, gridLayer, textLayer].filter(Boolean);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap mapStyle={MAP_STYLE} />
    </DeckGL>
  );
}
