import { getMap } from "@/service/server/getFile";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { map: string } }
) {
  const { map } = params;
  const data = getMap(`${map}.json`);
  return NextResponse.json(data);
}
