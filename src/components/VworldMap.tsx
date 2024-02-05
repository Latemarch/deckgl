"use client";
import Head from "next/head";
import { useEffect, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import { OSM } from "ol/source";
import { defaults } from "ol/control";
import { fromLonLat } from "ol/proj";
import { Tile } from "ol/layer";

export default function VworldMap() {
  useEffect(() => {
    // create Map instance
    const map = new Map({
      controls: defaults({ zoom: true, rotate: false }).extend([]),
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      target: "map",
      view: new View({
        center: fromLonLat([127.189972804, 37.723058796]),
        zoom: 15,
      }),
    });
  });

  return (
    <>
      {/* <Head>
        <title>VWorld Map Test</title>
        <meta name="description" content="VWorld Map Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <main>
        <h2>VWorld Map Test</h2>
        <div id="map" style={{ width: 500, height: 500 }}></div>
      </main>
    </>
  );
}
