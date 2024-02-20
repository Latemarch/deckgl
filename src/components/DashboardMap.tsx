/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Deck } from "@deck.gl/core/typed";
import { ArcLayer, GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
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
      onClick: (info) => {
        const { object } = info;
        console.log(object.properties.sido);
      },
      onHover: (info) => {
        const { object } = info;
        if (object) {
          const id = object.properties.sggCd;
          console.log(id, districtInfo[id]);
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
      data: Object.values(districtInfo).filter(
        (el: any) => el.sido === "41" && !el.adm_nm
      ),
      fontFamily: "Malgun Gothic",
      pickable: true,
      getPosition: (d) => d.center,
      getText: (d) => {
        console.log(d.center, d.sggnm);
        return d.sggnm;
      },
      getSize: 20,
      getAngle: 0,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      characterSet: createCharacterSet(),
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

function createCharacterSet() {
  const charSet = [];
  // ASCII 문자 추가 (공백 문자부터 '~'까지)
  for (let i = 32; i <= 127; i++) {
    charSet.push(String.fromCharCode(i));
  }
  // 한글 전체 범위 추가
  for (let i = 0xac00; i <= 0xd7a3; i++) {
    charSet.push(String.fromCharCode(i));
  }
  return charSet;
}
