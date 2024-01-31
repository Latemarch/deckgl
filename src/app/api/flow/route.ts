import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 여기에 비즈니스 로직을 추가합니다.

  return NextResponse.json({ ok: true });
}
