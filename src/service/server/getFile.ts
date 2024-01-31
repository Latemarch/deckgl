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
