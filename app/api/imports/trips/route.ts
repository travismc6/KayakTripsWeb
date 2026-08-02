import { API_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) { const upstream = await fetch(`${API_URL}/api/imports/trips`, { method: "POST", body: await request.formData() }); return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json" } }); }
