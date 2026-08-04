import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
export async function DELETE(_: NextRequest, { params }: { params: { id: string; personId: string } }) { const upstream = await fetch(`${API_URL}/api/trips/${params.id}/people/${params.personId}`, { method: "DELETE" }); if (upstream.ok) revalidatePath(`/trips/${params.id}`); return new NextResponse(await upstream.text(), { status: upstream.status }); }
