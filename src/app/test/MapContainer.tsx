"use client";
import * as React from "react";
import useMapData from "@/hooks/useMapData";
import { extractTopoLocation } from "@/service/client/topoJsonHandler";
import BaseMap from "@/components/deckgl/BaseMap";

export default function MapContainer() {
  const { useMapQuery, usePropertyQuery } = useMapData();
  const { data: topoJson } = useMapQuery("koreaTopo");
  const { data: districtInfo } = usePropertyQuery("districtInfo");
  const { data: textInfo } = usePropertyQuery("dashboardSgg");
  const geoJson = topoJson && extractTopoLocation("0", "sido", topoJson);
  return (
    // <div className="flex w-full h-full overflow-hidden">
    <div className="relative w-full h-full bg-black">
      {geoJson && districtInfo && <BaseMap geoJson={geoJson} />}
    </div>
  );
}
