import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Auth handled by Supabase (Prisma auth disabled)" },
    { status: 501 }
  );
}
