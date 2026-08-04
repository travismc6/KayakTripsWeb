import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const upstream = await fetch(`${API_URL}/api/trips/${params.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: await request.text() });
  if (upstream.ok) { revalidatePath(`/trips/${params.id}`); revalidatePath("/trips"); revalidatePath("/"); revalidatePath("/map"); }
  return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } });
}
