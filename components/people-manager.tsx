"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Plus, ShieldCheck, UserRound } from "lucide-react";
import { Person } from "@/lib/types";

export function PeopleManager({ initialPeople }: { initialPeople: Person[] }) {
  const [people, setPeople] = useState(initialPeople);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addPerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(null);
    const form = event.currentTarget; const data = new FormData(form);
    const response = await fetch("/api/people", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: data.get("name"), email: data.get("email") || null, isAdmin: data.get("isAdmin") === "on" }) });
    setSaving(false);
    if (!response.ok) { setError(await response.text() || "Person could not be added."); return; }
    const person: Person = await response.json(); setPeople(current => [...current, person].sort((a, b) => a.name.localeCompare(b.name))); form.reset();
  }

  return <div className="people-layout">
    <form className="panel person-form" onSubmit={addPerson}><div className="panel-head"><div><span className="eyebrow">New paddler</span><h2>Add a person</h2></div></div><div className="form-body"><label><span>Name</span><input name="name" required maxLength={200} placeholder="Paddler name" /></label><label><span>Email (optional)</span><input name="email" type="email" maxLength={320} placeholder="name@example.com" /></label><label className="check-label"><input name="isAdmin" type="checkbox" /><span>Administrator</span></label>{error && <div className="error-banner">{error}</div>}<button className="button" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <Plus />}{saving ? "Adding…" : "Add person"}</button></div></form>
    <section className="panel people-list"><div className="panel-head"><div><span className="eyebrow">Paddling crew</span><h2>{people.length} {people.length === 1 ? "person" : "people"}</h2></div></div>{people.length ? people.map(person => <div className="person-row" key={person.id}><span className="person-avatar"><UserRound /></span><div><strong>{person.name}</strong><small>{person.email || "No email address"}</small></div>{person.isAdmin && <span className="admin-pill"><ShieldCheck /> Admin</span>}</div>) : <div className="empty-inline"><UserRound /><h3>No people yet</h3><p>Add the first person to start assigning paddlers to trips.</p></div>}</section>
  </div>;
}
