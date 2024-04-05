import { useQuery } from "@tanstack/react-query";

export default function useMapData() {
  const useMapQuery = (name: string) =>
    useQuery({
      queryKey: ["map", name],
      queryFn: () => fetch(`/api/map/${name}`).then((res) => res.json()),
    });
  const usePropertyQuery = (name: string) =>
    useQuery({
      queryKey: ["property", name],
      queryFn: () => fetch(`/api/property/${name}`).then((res) => res.json()),
    });

  const useMapDataQuery = (dir: string, name: string) =>
    useQuery({
      queryKey: ["data", dir, name],
      queryFn: () =>
        fetch(`/api/data?dir=${dir}&name=${name}`).then((res) => res.json()),
    });

  const useGzQuery = (name: string) =>
    useQuery({
      queryKey: ["data", name],
      queryFn: () => fetch(`/api/gz?&name=${name}`).then((res) => res.json()),
    });

  return { useMapQuery, usePropertyQuery, useMapDataQuery, useGzQuery };
}
