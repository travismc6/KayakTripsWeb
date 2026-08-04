import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
export async function GET(_: NextRequest, { params }: { params: { id: string } }) { const upstream = await fetch(`${API_URL}/api/trips/${params.id}/people`, { cache: "no-store" }); return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "application/json" } }); }
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const upstream = await fetch(`${API_URL}/api/trips/${params.id}/people`, { method: "POST", headers: { "content-type": "application/json" }, body: await request.text(), cache: "no-store" });
    if (upstream.ok) revalidatePath(`/trips/${params.id}`);
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } });
  } catch (error) {
    console.error("Trip assignment request failed", error);
    return NextResponse.json({ message: "The trip service could not be reached. Please try again." }, { status: 502 });
  }
}
