"use client";
import * as React from "react";
import ArcMap from "./ArcMap";
import useMapData from "@/hooks/useMapData";
import {
  csvToJson,
  decompressGzipToCsv,
  decompressGzipToJson,
} from "@/service/client/handleGzip";

export default function MapContainer() {
  const { useMapQuery, usePropertyQuery, useGzQuery } = useMapData();
  const { data: topoJson } = useMapQuery("koreaTopo");
  const { data: districtInfo } = usePropertyQuery("districtInfo");
  const { data: textInfo } = usePropertyQuery("dashboardSgg");
  const { data: gz } = useGzQuery("odjson");
  const { data: csv } = useGzQuery("odcsv");
  // gz && console.log(gz);
  console.time("gz");
  const result = gz && decompressGzipToJson(gz.data);
  console.timeEnd("gz");
  console.time("csv");
  const csvResult = gz && decompressGzipToCsv(csv.data);
  console.timeEnd("csv");
  console.time("csv to json");
  const jsonFromcsv = csvResult && csvToJson(csvResult);
  console.timeEnd("csv to json");
  const filteredRes = result && filterRes(jsonFromcsv);
  console.time("filter");
  filteredRes && console.log(filteredRes.length);
  // filteredRes && console.log(filteredRes.length, filteredRes[0]);
  console.timeEnd("filter");
  // const districtInfo = getMapProperties("districtInfo.json");
  return (
    // <div className="flex w-full h-full overflow-hidden">
    <div className="relative w-full h-full">
      {/* {topoJson && districtInfo && (
        <ArcMap
          topoJson={topoJson}
          textInfo={textInfo}
          districtInfo={districtInfo}
        />
      )} */}
    </div>
  );
}

function filterRes(res: any) {
  return res.filter((el: any) => el["AGE_GRP"] === "6");
}
