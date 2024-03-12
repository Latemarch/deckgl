"use client";
import * as React from "react";
import ContourMap from "./ContourMap";
import useMapData from "@/hooks/useMapData";

export default function MapContainer() {
  const { useMapQuery, usePropertyQuery, useMapDataQuery } = useMapData();
  const { data: topoJson } = useMapQuery("koreaTopo");
  const { data: districtInfo } = usePropertyQuery("districtInfo");
  const { data: mapData } = useMapDataQuery("gis", "sampleSW");
  const { data: textInfo } = usePropertyQuery("dashboardSgg");
  // const districtInfo = getMapProperties("districtInfo.json");
  return (
    // <div className="flex w-full h-full overflow-hidden">
    <div className="w-full h-full">
      {topoJson && districtInfo && (
        <ContourMap
          data={mapData}
          textInfo={textInfo}
          topoJson={topoJson}
          districtInfo={districtInfo}
        />
      )}
    </div>
  );
}
