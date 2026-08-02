"use client";

import { ArrowUpDown, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, miles } from "@/lib/format";
import { TripSummary } from "@/lib/types";

export function TripsBrowser({ trips }: { trips: TripSummary[] }) {
  const [query, setQuery] = useState(""); const [state, setState] = useState("All"); const [sort, setSort] = useState("newest");
  const states = [...new Set(trips.map(t => t.state).filter(Boolean) as string[])].sort();
  const filtered = useMemo(() => trips.filter(t => state === "All" || t.state === state).filter(t => `${t.riverName} ${t.startPoint} ${t.endPoint} ${t.notes}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === "distance" ? (b.distanceMiles || 0) - (a.distanceMiles || 0) : sort === "river" ? a.riverName.localeCompare(b.riverName) : (b.startDate || "").localeCompare(a.startDate || "")), [trips, query, state, sort]);
  return <div className="browser"><div className="filterbar"><label><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search rivers, routes, or notes…" /></label><div className="select-wrap"><SlidersHorizontal size={16} /><select value={state} onChange={e => setState(e.target.value)}><option>All</option>{states.map(s => <option key={s}>{s}</option>)}</select></div><div className="select-wrap"><ArrowUpDown size={16} /><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="river">River A–Z</option><option value="distance">Longest first</option></select></div></div>
    <div className="results-head"><span>{filtered.length} of {trips.length} trips</span>{query && <button onClick={() => setQuery("")}>Clear search</button>}</div>
    <div className="trip-table"><div className="table-head"><span>Waterway</span><span>Route</span><span>Date</span><span>Distance</span><span>State</span><span /></div>{filtered.map(trip => <Link href={`/trips/${trip.id}`} key={trip.id} className="table-row"><div><strong>{trip.riverName}</strong><small>{trip.notes || "No trip notes"}</small></div><div><span>{trip.startPoint || "Unknown put-in"}</span><small>{trip.endPoint ? `to ${trip.endPoint}` : "Take-out not recorded"}</small></div><span>{formatDate(trip)}</span><strong>{miles(trip.distanceMiles)}</strong><span className="state-pill">{trip.state || "—"}</span><ChevronRight size={18} /></Link>)}</div>
    {!filtered.length && <div className="empty-inline"><Search /><h3>No matching trips</h3><p>Try a different river, route, or state.</p></div>}
  </div>;
}
