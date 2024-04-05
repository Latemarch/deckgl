//@ts-ignore
import * as pako from "pako";
import * as Papa from "papaparse";

export function decompressGzipToJson(compressedData: any) {
  try {
    // pako를 사용하여 GZIP 압축 해제
    const decompressed = pako.inflate(compressedData, { to: "string" });

    // 압축 해제된 문자열을 JSON으로 변환
    const json = JSON.parse(decompressed);

    return json;
  } catch (error) {
    console.error("Error decompressing GZIP or parsing JSON:", error);
    return null; // 또는 적절한 에러 처리
  }
}
export function decompressGzipToCsv(compressedData: any): string | null {
  try {
    // pako를 사용하여 GZIP 압축 해제
    const decompressed = pako.inflate(compressedData, { to: "string" });

    // 압축 해제된 CSV 문자열을 반환
    return decompressed;
  } catch (error) {
    console.error("Error decompressing GZIP:", error);
    return null; // 또는 적절한 에러 처리
  }
}

export function csvToJson(csvString: string) {
  // Papa.parse를 동기적으로 사용하여 CSV 데이터를 파싱합니다.
  const results = Papa.parse(csvString, {
    header: true, // CSV의 첫 번째 줄을 객체의 키로 사용합니다.
    skipEmptyLines: true, // 비어 있는 줄은 건너뜁니다.
  });

  // 파싱된 데이터를 반환합니다.
  return results.data;
}
