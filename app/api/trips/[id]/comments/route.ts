import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const personId = request.headers.get("x-kayaktrips-person-id");
  const proxySecret = process.env.KAYAKTRIPS_COMMENTS_PROXY_SECRET;
  if (!personId) return NextResponse.json({ message: "Select a person before commenting." }, { status: 401 });
  if (!proxySecret) return NextResponse.json({ message: "Commenting is not configured." }, { status: 503 });
  try {
    const upstream = await fetch(`${API_URL}/api/trips/${params.id}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-kayaktrips-person-id": personId, "x-kayaktrips-proxy-secret": proxySecret },
      body: await request.text(),
      cache: "no-store"
    });
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") || "text/plain" } });
  } catch (error) {
    console.error("Comment request failed", error);
    return NextResponse.json({ message: "The trip service could not be reached. Please try again." }, { status: 502 });
  }
}
