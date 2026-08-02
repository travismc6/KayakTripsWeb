"use client";
import { Camera, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function PhotoUpload({ tripId }: { tripId: string }) {
  const ref = useRef<HTMLInputElement>(null); const [loading, setLoading] = useState(false); const router = useRouter();
  async function upload(file?: File) { if (!file) return; setLoading(true); const form = new FormData(); form.append("file", file); const response = await fetch(`/api/trips/${tripId}/photos`, { method: "POST", body: form }); setLoading(false); if (response.ok) router.refresh(); else alert(await response.text() || "Photo upload failed."); }
  return <><input ref={ref} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e.target.files?.[0])} /><button className="button secondary" disabled={loading} onClick={() => ref.current?.click()}>{loading ? <LoaderCircle className="spin" /> : <Camera />} {loading ? "Uploading…" : "Add a photo"}</button></>;
}
