"use client";
import * as React from "react";
import DashboardMap from "./DashboardMap";
import useMapData from "@/hooks/useMapData";

export default function MapContainer() {
  const { useMapQuery, usePropertyQuery } = useMapData();
  const { data: topoJson } = useMapQuery("koreaTopo");
  const { data: sggInfo } = usePropertyQuery("dashboardSgg");

  return (
    <div className="relative w-full h-full">
      {topoJson && sggInfo && (
        <DashboardMap topoJson={topoJson} districtInfo={sggInfo} />
      )}
    </div>
  );
}

// function makeCityInfo(info:any){
//   const newInfo =
// }

// function removeSi(el: any) {
//   const str = el.sggnm;
//   if (!str) return str;
//   if (str.length > 4) return str.slice(0, 2);
//   if (str.endsWith("시")) {
//     return str.slice(0, -1);
//   }

//   return str;
// }
