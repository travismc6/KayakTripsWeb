import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const personId = request.headers.get("x-kayaktrips-person-id");
  if (!personId) return NextResponse.json({ message: "Select a person before commenting." }, { status: 401 });
  try {
    const upstream = await fetch(`${API_URL}/api/trips/${params.id}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-kayaktrips-person-id": personId },
      body: await request.text(),
      cache: "no-store"
    });
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } });
  } catch (error) {
    console.error("Comment request failed", error);
    return NextResponse.json({ message: "The trip service could not be reached. Please try again." }, { status: 502 });
  }
}
