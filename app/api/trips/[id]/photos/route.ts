import { API_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const personId = request.headers.get("x-kayaktrips-person-id");
  if (!personId) return NextResponse.json({ message: "Select a person before adding a photo." }, { status: 401 });
  const upstream = await fetch(`${API_URL}/api/trips/${params.id}/photos`, { method: "POST", headers: { "x-kayaktrips-person-id": personId }, body: await request.formData() });
  return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } });
}
