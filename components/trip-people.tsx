"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Plus, UserMinus, Users } from "lucide-react";
import { Person, TripPerson } from "@/lib/types";

export function TripPeople({ tripId, people, initialAssignments }: { tripId: string; people: Person[]; initialAssignments: TripPerson[] }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null);
  const available = people.filter(person => !assignments.some(item => item.personId === person.id));

  async function assign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null); const form = event.currentTarget; const data = new FormData(form);
    const response = await fetch(`/api/trips/${tripId}/people`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ personId: data.get("personId"), role: data.get("role") || null }) }); setBusy(false);
    if (!response.ok) { setError(await response.text() || "Person could not be assigned."); return; }
    const assignment: TripPerson = await response.json(); setAssignments(current => [...current, assignment]); form.reset();
  }
  async function remove(personId: string) { setBusy(true); setError(null); const response = await fetch(`/api/trips/${tripId}/people/${personId}`, { method: "DELETE" }); setBusy(false); if (!response.ok) { setError(await response.text() || "Assignment could not be removed."); return; } setAssignments(current => current.filter(item => item.personId !== personId)); }

  return <section className="panel trip-people-panel"><div className="panel-head"><div><span className="eyebrow">Paddling crew</span><h2>People on this trip</h2></div></div><div className="trip-people-body">{assignments.length ? <div className="assignment-list">{assignments.map(item => <div className="assignment-row" key={item.personId}><span className="person-avatar"><Users /></span><div><strong>{item.name}</strong><small>{item.role || "Paddler"}</small></div><button className="icon-button" disabled={busy} onClick={() => remove(item.personId)} aria-label={`Remove ${item.name}`}><UserMinus /></button></div>)}</div> : <p className="muted">No one has been assigned yet.</p>}
    {available.length ? <form className="assignment-form" onSubmit={assign}><select name="personId" required defaultValue=""><option value="" disabled>Choose a person</option>{available.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select><input name="role" maxLength={100} placeholder="Role (optional)" /><button className="button" disabled={busy}>{busy ? <LoaderCircle className="spin" /> : <Plus />}Assign</button></form> : <p className="muted">{people.length ? "Everyone is assigned to this trip." : "Add people from the People page first."}</p>}{error && <div className="error-banner">{error}</div>}</div></section>;
}
