"use client";
import * as React from "react";
import ArcMap from "./ArcMap";
import useMapData from "@/hooks/useMapData";

export default function MapContainer() {
  const { useMapQuery, usePropertyQuery } = useMapData();
  const { data: topoJson } = useMapQuery("koreaTopo");
  const { data: districtInfo } = usePropertyQuery("districtInfo");
  const { data: textInfo } = usePropertyQuery("dashboardSgg");
  // const districtInfo = getMapProperties("districtInfo.json");
  return (
    // <div className="flex w-full h-full overflow-hidden">
    <div className="relative w-full h-full">
      {topoJson && districtInfo && (
        <ArcMap
          topoJson={topoJson}
          textInfo={textInfo}
          districtInfo={districtInfo}
        />
      )}
    </div>
  );
}
