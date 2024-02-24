/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { Deck } from "@deck.gl/core/typed";
import { ArcLayer, GeoJsonLayer } from "@deck.gl/layers/typed";
import mapboxgl from "mapbox-gl";
import { getSggScaleSidoGeoJson } from "@/service/client/manipulateMap";

const INITIAL_VIEW_STATE = {
  longitude: -100,
  latitude: 40.7,
  zoom: 3,
  maxZoom: 15,
  pitch: 30,
  bearing: 30,
};
const inFlowColors = [
  [255, 255, 204],
  [199, 233, 180],
  [127, 205, 187],
  [65, 182, 196],
  [29, 145, 192],
  [34, 94, 168],
  [12, 44, 132],
];

const outFlowColors = [
  [255, 255, 178],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
  [227, 26, 28],
  [177, 0, 38],
];

export default function ArcExample({ data, topoJson, path }: any) {
  // console.log(data);
  useEffect(() => {
    const deckgl = new Deck({
      initialViewState: INITIAL_VIEW_STATE,
      controller: true,
      layers: [],
    });
    function getArcLayer(data: any, selectedFeature: any) {
      const { flows, centroid } = selectedFeature.properties;
      const arcs = Object.keys(flows).map((toId) => {
        const f = data.features[toId];
        return {
          source: centroid,
          target: f.properties.centroid,
          value: flows[toId],
        };
      });

      // const scale = d3
      //   .scaleQuantile()
      //   .domain(arcs.map((a) => Math.abs(a.value)))
      //   .range(inFlowColors.map((c, i) => i));

      // arcs.forEach((a) => {
      //   a.gain = Math.sign(a.value);
      //   a.quantile = scale(Math.abs(a.value));
      // });

      return new ArcLayer({
        id: "arc",
        data: arcs,
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getSourceColor: (d) =>
          (d.gain > 0 ? inFlowColors : outFlowColors)[d.quantile] as any,
        getTargetColor: (d) =>
          (d.gain > 0 ? outFlowColors : inFlowColors)[d.quantile] as any,
        strokeWidth: 4,
      });
    }

    function renderLayers(data: any, selectedFeature: any | undefined) {
      selectedFeature =
        selectedFeature ||
        data.features.find((f: any) => f.properties.name === "Los Angeles, CA");
      const arcLayer = getArcLayer(data, selectedFeature);
      console.log("data in the fnt ", data);
      const countyLayer = new GeoJsonLayer({
        id: "geojson",
        data: data,
        stroked: false,
        filled: true,
        autoHighlight: true,
        pickable: true,
        getFillColor: () => [100, 100, 100],
        onClick: (info) => renderLayers(data, info.object),
      });

      deckgl.setProps({ layers: [countyLayer, arcLayer] });
    }

    fetch(
      "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/arc/counties.json"
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        renderLayers(data);
      });

    // Clean up
    return () => {
      deckgl.finalize();
      // map.remove();
    };
  }, []); // Add dependencies here if necessary

  return <></>;
}
