import path from "path";
import fs from "fs";

export function getMapProperties(name: string) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "maps",
    "properties",
    name
  );
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
}

export function getData(dir: string, name: string): JSON {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    dir,
    name + ".json"
  );
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
}
export function getGz(name: string): any {
  const filePath = path.join(process.cwd(), "public", "data", name + ".gz");
  const fileContent = fs.readFileSync(filePath);
  // 파일의 내용을 Buffer 객체로 반환합니다.
  return fileContent;
}

export function getMap(name: string) {
  const filePath = path.join(process.cwd(), "public", "maps", name);
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
}

export function getPath(name: string) {
  const filePath = path.join(process.cwd(), "public", "paths", name);
  const file = fs.readFileSync(filePath, "utf8");
  return JSON.parse(file);
}

export function saveJson(data: any, filename = "output.json") {
  const filePath = path.join(process.cwd(), "public", filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
