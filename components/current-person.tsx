"use client";

import { useEffect, useState } from "react";
import { Person } from "@/lib/types";

const STORAGE_KEY = "kayaktrips-current-person";

export function CurrentPerson() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected(localStorage.getItem(STORAGE_KEY) || "");
    fetch("/api/people").then(response => response.ok ? response.json() : []).then(setPeople).catch(() => setPeople([]));
  }, []);

  const current = people.find(person => person.id === selected);
  function choose(id: string) {
    setSelected(id);
    if (id) localStorage.setItem(STORAGE_KEY, id); else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("kayaktrips-person-changed", { detail: id }));
  }

  return <div className="sidebar-foot identity-picker">
    <div className="current-user">{current ? initials(current.name) : "?"}</div>
    <label><span>Logged in as</span><select value={selected} onChange={event => choose(event.target.value)} aria-label="Select logged in person"><option value="">Select a person</option>{people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
  </div>;
}

function initials(name: string) { return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase(); }
