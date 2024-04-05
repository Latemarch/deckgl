import { getGz } from "@/service/server/getFile";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get("name");

  console.log("wtf");
  // 콘솔에 dir과 name 값 로그
  if (!name) return NextResponse.json({ ok: false, msg: "missing param(s)" });
  const res = getGz(name);
  console.log("res", res);

  return NextResponse.json(res);
}
