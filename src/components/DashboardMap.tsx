"use client";
import React, { useEffect } from "react";
import { Deck } from "@deck.gl/core/typed";
import { ArcLayer, GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
import mapboxgl from "mapbox-gl";
import { getSggScaleSidoGeoJson } from "@/service/client/manipulateMap";

const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

export default function DashboardMap({ topoJson, districtInfo }: any) {
  const sidoJson = getSggScaleSidoGeoJson(topoJson, "41");
  const centers = Object.values(districtInfo)
    .filter((el: any) => el.sido === "41" && !el.adm_cd2)
    .map((v: any) => v.center);
  const base = centers[0];

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
      onHover: ({ object }) => {
        if (object) {
          const id = object.properties.sggCd;
          console.log(districtInfo[id]);
        }
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

    const textLayer = new TextLayer({
      id: "text-layer",
      // data: Object.values(districtInfo).filter(
      // (el: any) => el.sido === "41" && !el.adm_nm
      // ),
      data: [
        { center: [126.9918, 37.552], sggnm: "english?" },
        {
          center: [127.078, 37.332],
          sggnm: "wdkwjd",
        },
        { center: [126.81729284036214, 37.864708747525164], sggnm: "파주시" },
      ],
      pickable: true,
      getPosition: (d) => d.center,
      getText: (d) => {
        console.log(d.center, d.sggnm);
        return d.sggnm;
      },
      getSize: 32,
      getAngle: 0,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
    });
    const deckgl = new Deck({
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [geoJsonLayer, arcLayer, textLayer],
    });
    // deckgl.setProps({ layers: [arcLayer] });

    // Clean up
    return () => {
      deckgl.finalize();
    };
  }, []);

  // return <div id="map" className="fixed w-full h-full" />;
  return <div className="w-20 h-10 bg-gray-300 text-red-800">tooltip</div>;
}
