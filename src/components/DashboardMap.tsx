"use client";
import React, { useEffect } from "react";
import { Deck } from "@deck.gl/core/typed";
import { ArcLayer, GeoJsonLayer } from "@deck.gl/layers/typed";
import mapboxgl from "mapbox-gl";
import { getSggScaleSidoGeoJson } from "@/service/client/manipulateMap";

const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

export default function DashboardMap({ topoJson, districtInfo }: any) {
  const sidoJson = getSggScaleSidoGeoJson(topoJson, "41");
  const centers = Object.values(districtInfo)
    .filter((el: any) => el.sido === "41" && !el.adm_cd2)
    .map((v: any) => v.center);
  const base = centers[0];

  console.log(sidoJson);
  useEffect(() => {
    const geoJsonLayer = new GeoJsonLayer({
      id: "geojson-layer",
      data: sidoJson.features,
      pickable: true,
      stroked: true,
      filled: true,
      lineWidthScale: 1,
      lineWidthMinPixels: 1,
      getFillColor: [100, 160, 180, 200],
      opacity: 0.5,
      getLineWidth: 1,
      onClick: ({ object }) => {
        console.log(object.properties.sido);
      },
    });
    const arcLayer = new ArcLayer({
      id: "arcs",
      data: centers,
      getSourcePosition: base,
      getTargetPosition: (d, i) => {
        return d;
      },
      getSourceColor: [255, 255, 255],
      getTargetColor: [0, 128, 255], // 예시 색상: 파란색
      getWidth: 3,
    });
    const deckgl = new Deck({
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [geoJsonLayer, arcLayer],
    });
    // deckgl.setProps({ layers: [arcLayer] });

    // Clean up
    return () => {
      deckgl.finalize();
    };
  }, []);

  return <div id="map" className="fixed w-full h-full" />;
}
