/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import DeckGL from "@deck.gl/react/typed";
import { Feature, FeatureCollection } from "geojson";
import { GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
import hexToRgb from "@/service/client/hexToRgb";
import { extractTopoLocation } from "@/service/client/topoJsonHandler";
import {
  animateFeatureNorth,
  animateTextNorth,
} from "@/service/client/dashboardanimator";

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
  districtInfo: any;
};
export default function DashboardMap({ topoJson, districtInfo }: Props) {
  const [selectedCity, setSelectedCity] = React.useState(null);
  const [textInfo, setTextInfo] = React.useState(districtInfo);
  const [feature, setFeature] = React.useState(null);
  const geoJson = React.useMemo(
    () => extractTopoLocation("41", topoJson),
    [selectedCity]
  );

  React.useMemo(() => {
    if (!selectedCity) return;
    const f = getGeoJsonFeature(selectedCity, geoJson);
    if (f) animateFeatureNorth(f, setFeature);
    animateTextNorth(districtInfo, selectedCity, setTextInfo);
  }, [selectedCity]);

  const geoJsonLayer = new GeoJsonLayer({
    id: "geojson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    filled: true,
    lineWidthScale: 100,
    getFillColor: (d: Feature) => {
      if (d.properties?.sgg === selectedCity) return hexToRgb("#1B2130", 1);
      return [81, 110, 131];
    },
    getLineColor: hexToRgb("#1B2130", 1),
    getLineWidth: 5,
    onClick: ({ object }) => {
      if (!object) return;
      setSelectedCity(object.properties.sgg);
    },
  });

  const floatedGeoJsonLayer =
    feature &&
    new GeoJsonLayer({
      id: "selected-city",
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

  const textLayer = new TextLayer({
    id: "text-layer",
    data: textInfo,
    pickable: false,
    getColor: [255, 255, 255],
    getPosition: (d) => d.center,
    getText: (d) => d.sggnm,
    getSize: 14,
    getAngle: 0,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center",
    characterSet: "auto",
  });

  const layers = [geoJsonLayer, floatedGeoJsonLayer, textLayer].filter(Boolean);
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={false}
      layers={layers}
    />
  );
}

function getGeoJsonFeature(
  selectedCity: string | null,
  geoJson: FeatureCollection
): Feature | null {
  if (!selectedCity) return null;
  const selectedFeature: Feature[] = geoJson.features.filter(
    (f: Feature) => f.properties?.sgg === selectedCity
  );
  return selectedFeature[0];
}
