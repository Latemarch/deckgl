import { getMapProperties } from "@/service/server/getFile";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { name: string } }
) {
  const { name } = params;
  const data = getMapProperties(`${name}.json`);
  return NextResponse.json(data);
}
