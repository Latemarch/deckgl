/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Deck } from "@deck.gl/core/typed";
import { ArcLayer, GeoJsonLayer, TextLayer } from "@deck.gl/layers/typed";
import { getSggScaleSidoGeoJson } from "@/service/client/manipulateMap";

const INITIAL_VIEW_STATE = {
  longitude: 126.9918,
  latitude: 37.552,
  zoom: 8.5,
  pitch: 45,
  bearing: -10,
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
    const flight = centers.map((center, index) => {
      const obj: any = { id: index, base, center, alt: 0 };
      const baseTime = 1600000000000; // 기준 시간 (예: 2020-09-13T12:26:40.000Z의 타임스탬프)
      const departureInterval = 60000; // 1분 간격
      obj.time1 = baseTime + index * departureInterval;
      obj.time2 = obj.time1 + departureInterval; // 각 항공편의 비행 시간을 1분으로 가정
      return obj;
    });

    const textLayer = new TextLayer({
      id: "text-layer",
      data: Object.values(districtInfo).filter(
        (el: any) => el.sido === "41" && !el.adm_nm
      ),
      // fontFamily: "Nanum Gothic",
      pickable: true,
      getPosition: (d) => d.center,
      getText: (d) => d.sggnm,
      getSize: 20,
      getAngle: 0,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      // characterSet: "auto",
      // characterSet: createCharacterSet(),
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
  return <></>;
}
