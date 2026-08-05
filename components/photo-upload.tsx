"use client";
import { Camera, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { Photo } from "@/lib/types";

export function PhotoUpload({ tripId, personId, onUploaded }: { tripId: string; personId: string; onUploaded: (photo: Photo) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  async function upload(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch(`/api/trips/${tripId}/photos`, { method: "POST", headers: { "x-kayaktrips-person-id": personId }, body: form });
      if (!response.ok) throw new Error(await response.text() || "Photo upload failed.");
      onUploaded(await response.json() as Photo);
      if (ref.current) ref.current.value = "";
    } catch (reason) { alert(reason instanceof Error ? reason.message : "Photo upload failed."); }
    finally { setLoading(false); }
  }
  return <><input ref={ref} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e.target.files?.[0])} /><button type="button" className="button secondary" disabled={loading} onClick={() => ref.current?.click()}>{loading ? <LoaderCircle className="spin" /> : <Camera />} {loading ? "Uploading…" : "Add a photo"}</button></>;
}
