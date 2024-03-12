import { getData } from "@/service/server/getFile";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dir = url.searchParams.get("dir");
  const name = url.searchParams.get("name");

  // 콘솔에 dir과 name 값 로그
  if (!dir || !name)
    return NextResponse.json({ ok: false, msg: "missing param(s)" });
  const res = getData(dir, name);

  return NextResponse.json(res);
}
