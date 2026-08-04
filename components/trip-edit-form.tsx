"use client";

import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { TripDetail } from "@/lib/types";

export function TripEditForm({ trip }: { trip: TripDetail }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null);
    const data = new FormData(event.currentTarget);
    const number = (name: string) => data.get(name) === "" ? null : Number(data.get(name));
    const hours = number("timeHours") ?? 0, minutes = number("timeMinutes") ?? 0;
    const response = await fetch(`/api/trips/${trip.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({
      riverName: data.get("riverName"), name: data.get("name") || null,
      states: String(data.get("states") || "").split(",").map(x => x.trim()).filter(Boolean),
      startDate: data.get("startDate") || null, endDate: data.get("endDate") || null,
      startPoint: data.get("startPoint") || null, startLatitude: number("startLatitude"), startLongitude: number("startLongitude"),
      endPoint: data.get("endPoint") || null, endLatitude: number("endLatitude"), endLongitude: number("endLongitude"),
      distanceMiles: number("distanceMiles"), timeMinutes: hours * 60 + minutes, notes: data.get("notes") || null
    }) });
    setSaving(false);
    if (!response.ok) { setError(await response.text() || "Trip could not be saved."); return; }
    router.push(`/trips/${trip.id}`); router.refresh();
  }

  const field = (label: string, name: string, value: string | number | null, type = "text", step?: string) => <label><span>{label}</span><input name={name} type={type} step={step} defaultValue={value ?? ""} /></label>;
  return <div className="edit-trip-page"><div className="detail-top"><Link href={`/trips/${trip.id}`}><ArrowLeft /> Cancel and return</Link></div>
    <header className="page-header"><div><span className="eyebrow">Trip-level details</span><h1>Edit trip</h1><p>Changes here override the overall trip summary. Individual legs remain unchanged.</p></div></header>
    <form className="panel trip-edit-form" onSubmit={save}>
      <section><h2>Overview</h2><div className="edit-grid">{field("Trip name", "name", trip.name)}{field("River or waterway", "riverName", trip.riverName)}{field("States (comma-separated)", "states", trip.states.join(", "))}{field("Distance (miles)", "distanceMiles", trip.distanceMiles, "number", "0.1")}{field("Start date", "startDate", trip.startDate, "date")}{field("End date", "endDate", trip.endDate, "date")}</div></section>
      <section><h2>Time on water</h2><div className="edit-grid time-grid">{field("Hours", "timeHours", Math.floor((trip.timeMinutes ?? 0) / 60), "number", "1")}{field("Minutes", "timeMinutes", (trip.timeMinutes ?? 0) % 60, "number", "1")}</div></section>
      <section><h2>Put-in</h2><div className="edit-grid">{field("Start point", "startPoint", trip.startPoint)}{field("Latitude", "startLatitude", trip.startLatitude, "number", "any")}{field("Longitude", "startLongitude", trip.startLongitude, "number", "any")}</div></section>
      <section><h2>Take-out</h2><div className="edit-grid">{field("End point", "endPoint", trip.endPoint)}{field("Latitude", "endLatitude", trip.endLatitude, "number", "any")}{field("Longitude", "endLongitude", trip.endLongitude, "number", "any")}</div></section>
      <section><h2>Notes</h2><label><span>Trip notes</span><textarea name="notes" rows={5} defaultValue={trip.notes ?? ""} /></label></section>
      {error && <div className="error-banner">{error}</div>}<div className="edit-actions"><Link className="button secondary" href={`/trips/${trip.id}`}>Cancel</Link><button className="button" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Save />}{saving ? "Saving…" : "Save trip"}</button></div>
    </form></div>;
}
