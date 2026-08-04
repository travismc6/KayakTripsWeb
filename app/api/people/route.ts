import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
export async function GET() { const upstream = await fetch(`${API_URL}/api/people`, { cache: "no-store" }); return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json" } }); }
export async function POST(request: NextRequest) { const upstream = await fetch(`${API_URL}/api/people`, { method: "POST", headers: { "content-type": "application/json" }, body: await request.text() }); if (upstream.ok) revalidatePath("/people"); return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } }); }
