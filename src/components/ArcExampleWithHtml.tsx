/* eslint-disable react-hooks/exhaustive-deps */
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

export default function ArcExampleWithHtml({ data, topoJson, path }: any) {
  // console.log(data);
  useEffect(() => {
    // Initialize mapbox-gl map
    // const map = new mapboxgl.Map({
    //   container: "map", // container id
    //   style: "mapbox://styles/mapbox/dark-v11", // map style URL
    //   accessToken: process.env.NEXT_PUBLIC_MAPBOX_APIKEY,
    //   center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude], // starting position
    //   zoom: INITIAL_VIEW_STATE.zoom, // starting zoom
    // });

    // Initialize DeckGL
    const base = data[0];

    const sidoJson = getSggScaleSidoGeoJson(topoJson, "41");
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
      data,
      getSourcePosition: base,
      getTargetPosition: (d, i) => {
        console.log(d, i);
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
      // This is where you can add mapbox-gl map to sync with DeckGL
      // onViewStateChange: ({ viewState }) => {
      //   map.jumpTo({
      //     center: [viewState.longitude, viewState.latitude],
      //     zoom: viewState.zoom,
      //     bearing: viewState.bearing,
      //     pitch: viewState.pitch,
      //   });
      // },
    });
    // deckgl.setProps({ layers: [arcLayer] });

    // Clean up
    return () => {
      deckgl.finalize();
      // map.remove();
    };
  }, []); // Add dependencies here if necessary

  return <div id="map" className="fixed w-full h-full" />;
}
