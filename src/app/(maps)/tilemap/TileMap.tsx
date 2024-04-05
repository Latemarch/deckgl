"use client";
import * as React from "react";
import DeckGL from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { Topology } from "topojson-specification";
import { extractTopoLocation } from "@/service/client/topoJsonHandler";
//@ts-ignore
import { TileLayer } from "@deck.gl/geo-layers";
//@ts-ignore
import { BitmapLayer } from "@deck.gl/layers";
//@ts-ignore
import { MaskExtension } from "@deck.gl/extensions";
import proj4 from "proj4";

const INITIAL_VIEW_STATE = {
  longitude: 127.1,
  latitude: 37.352,
  zoom: 6,
  // pitch: 45,
  // bearing: 30,
  minZoom: 6,
  // maxZoom: 10,
};

type Props = {
  topoJson: Topology;
  districtInfo: any;
  textInfo: any;
};
export default function TileMap({ topoJson, districtInfo, textInfo }: Props) {
  const geoJson = extractTopoLocation("0", topoJson);

  const geoJsonLayer = new GeoJsonLayer({
    id: "geoJson-layer",
    data: geoJson.features,
    pickable: true,
    stroked: true,
    lineWidthScale: 100,
    getLineWidth: 1,
    getFillColor: [255, 255, 255, 80],
    getLineColor: [255, 255, 255, 80],
    filled: true,
  });

  // const tileLayer = new TileLayer({
  //   // data: "http://xdworld.vworld.kr:8080/2d/Satellite/201710/{z}/{x}/{y}.jpeg",
  //   data: "https://xdworld.vworld.kr/2d/midnight/service/{z}/{x}/{y}.png",
  //   // data: "https://tile.gis.kt.com/current/base.default/{z}/{x}/{y}.png?v=20240307",
  //   minZoom: 3,
  //   maxZoom: 19,

  //   renderSubLayers: (props: any) => {
  //     const {
  //       bbox: { west, south, east, north },
  //     } = props.tile;
  //     console.log(west, south, east, north);

  //     return new BitmapLayer(props, {
  //       data: null,
  //       image: props.data,
  //       bounds: [west, south, east, north],
  //       desaturate: 0.7,
  //     });
  //   },
  //   extensions: [new MaskExtension()],
  //   maskId: "geoJson-layer",
  //   tintColor: [200, 180, 180],
  //   visible: true,
  // });
  //npm install proj4 필요

  //필요없는 부분 생략

  const tileLayer = new TileLayer({
    id: "background-map",
    //data:   "./test1.png",

    tileSize: 256,

    // 먼저 getTileLayer가 작동하고
    // 그 후에 renderSubLayer가 작동함
    getTileData: ({ index, signal, bbox }) => {
      if (signal.aborted) {
        console.log("signal.aborted:", signal);
        return null;
      }

      const ktmapExtent = {
        minx: 171162,
        miny: 1214781,
        maxx: 1744026,
        maxy: 2787645,
      };

      // EPSG:4326과 EPSG:5179의 정의
      const epsg4326 = "EPSG:4326";
      const epsg5179 =
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

      const adjustedZ = index.z - 6; // 서버가 일반적인 줌 레벨보다 6만큼 작게 처리

      //일단, 현재 타일의 위경도 중심점을 찾는다.
      const tileCenter4326 = proj4(epsg4326, epsg5179, [
        (bbox.west + bbox.east) / 2,
        (bbox.south + bbox.north) / 2,
      ]);
      const diff = {
        x: tileCenter4326[0] - ktmapExtent.minx,
        y: ktmapExtent.maxy - tileCenter4326[1],
      };

      const tileSize = 256; //px
      const res = 2048 / Math.pow(2, adjustedZ);
      const tile_x_index = parseInt(diff.x / (res * tileSize));
      const tile_y_index = parseInt(diff.y / (res * tileSize));

      const newUrl = `https://tile.gis.kt.com/current/base.default/${adjustedZ}/${tile_y_index}/${tile_x_index}.png`;

      // 타일 데이터를 반환하기 위한 fetch 호출
      return fetch(newUrl)
        .then((response) => response.blob())
        .then((blob) => createImageBitmap(blob));
    },

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      const epsg4326 = "EPSG:4326";
      const epsg5179 =
        "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

      //kt map 한계범위(epsg5179 좌표계)
      const ktmapExtent = {
        minx: 171162,
        miny: 1214781,
        maxx: 1744026,
        maxy: 2787645,
      };

      const adjustedZ = props.tile.zoom - 6; //ktmap은 표준과 6 차이남

      //현재 처리하는 타일의 기준 좌표는 epsg4326 기준.
      //처리하는 타일의 사각형 네 꼭지점  [x0,y0], [x1,y1],[x2,y2],[x3,y3] 을 구한다.
      //구하는 사각형은 우선 epsg5179 기준으로 구하고(tile5179) - epsg5179에서 정사각형임
      //좌표계 변환하여 epsg4326의 네 꼭지점( [x0,y0], [x1,y1],[x2,y2],[x3,y3])으로 변환한다. - epsg4326에서 부정형의 사각형이 됨
      //그 부정형의 사각형에 epsg5179의 정사각형 타일맵을 텍스쳐로 입힘
      //텍스쳐 변환은 gpu에서 이루어짐
      const tileCenter4326 = proj4(epsg4326, epsg5179, [
        (west + east) / 2,
        (south + north) / 2,
      ]);
      const diff = {
        x: tileCenter4326[0] - ktmapExtent.minx,
        y: ktmapExtent.maxy - tileCenter4326[1],
      };

      const tileSize = 256; //px
      const res = 2048 / Math.pow(2, adjustedZ);
      const tile5179_xmin =
        parseInt(diff.x / (res * tileSize)) * (res * tileSize) +
        ktmapExtent.minx;
      const tile5179_ymax =
        ktmapExtent.maxy -
        parseInt(diff.y / (res * tileSize)) * (res * tileSize);

      const tile5179 = {
        xmin: tile5179_xmin,
        xmax: tile5179_xmin + res * tileSize,
        ymin: tile5179_ymax - res * tileSize,
        ymax: tile5179_ymax,
      };

      const [x0, y0] = proj4(epsg5179, epsg4326, [
        tile5179.xmin,
        tile5179.ymin,
      ]);
      const [x1, y1] = proj4(epsg5179, epsg4326, [
        tile5179.xmin,
        tile5179.ymax,
      ]);
      const [x2, y2] = proj4(epsg5179, epsg4326, [
        tile5179.xmax,
        tile5179.ymax,
      ]);
      const [x3, y3] = proj4(epsg5179, epsg4326, [
        tile5179.xmax,
        tile5179.ymin,
      ]);

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [
          [x0, y0],
          [x1, y1],
          [x2, y2],
          [x3, y3],
        ],
        desaturate: 0.7,
        //transparentColor: [255, 0, 0, 255],
      });
    },
    //extent: [117, 28, 133, 44],
    refinementStrategy: "no-overlap",
    onTileError: (error, tile) => {},
    onHover: ({ lngLat }) => {
      //console.log(`Longitude: ${lngLat[0]}, Latitude: ${lngLat[1]}`);
    },
    parameters: {
      depthTest: false,
    },

    //tintColor: [200, 180, 180],
    visible: true,
  });
  const layers = [tileLayer].filter(Boolean);
  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    ></DeckGL>
  );
}
