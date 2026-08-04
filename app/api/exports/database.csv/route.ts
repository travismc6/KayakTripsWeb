import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
export async function GET() { const upstream = await fetch(`${API_URL}/api/exports/database.csv`, { cache: "no-store" }); return new NextResponse(upstream.body, { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/csv; charset=utf-8", "content-disposition": upstream.headers.get("content-disposition") || "attachment; filename=kayaktrips.csv" } }); }
