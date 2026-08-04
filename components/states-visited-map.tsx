"use client";

import usa from "@svg-maps/usa";
import Link from "next/link";
import { useMemo, useState } from "react";

type RiverSummary = { name: string; tripCount: number; totalMiles: number; latestDate: string | null; latestTripId: string };
type StateRivers = { code: string; rivers: RiverSummary[] };
type StateLocation = { id: string; name: string; path: string };
const map = usa as { viewBox: string; locations: StateLocation[] };

export function StatesVisitedMap({ states }: { states: StateRivers[] }) {
  const data = useMemo(() => new Map(states.map(state => [state.code.toLowerCase(), state])), [states]);
  const max = Math.max(1, ...states.map(state => state.rivers.length));
  const initial = [...states].sort((a, b) => b.rivers.length - a.rivers.length)[0]?.code.toLowerCase() ?? null;
  const [active, setActive] = useState<string | null>(initial);
  const [selectedCode, setSelectedCode] = useState<string | null>(initial);
  const selected = active ? data.get(active) : undefined;
  const selectedList = selectedCode ? data.get(selectedCode) : undefined;
  const stateName = active ? map.locations.find(location => location.id === active)?.name : null;
  const selectedStateName = selectedCode ? map.locations.find(location => location.id === selectedCode)?.name : null;

  return <section className="panel states-map-panel">
    <div className="states-map-summary" aria-live="polite">
      {selected ? <><strong>{stateName}</strong><span>{selected.rivers.length} distinct {selected.rivers.length === 1 ? "river" : "rivers"}</span><small>{selected.rivers.map(river => river.name).join(" · ")}</small></> : <><strong>Explore the map</strong><span>Hover or focus a visited state</span></>}
    </div>
    <svg className="states-map" viewBox={map.viewBox} role="img" aria-label="Map of visited U.S. states shaded by distinct river count">
      {map.locations.map(location => {
        const item = data.get(location.id);
        const level = item ? Math.max(1, Math.ceil(item.rivers.length / max * 4)) : 0;
        const label = item ? `${location.name}: ${item.rivers.length} distinct ${item.rivers.length === 1 ? "river" : "rivers"}` : `${location.name}: not visited`;
        return <path key={location.id} d={location.path} className={`state-shape level-${level}${active === location.id ? " active" : ""}${selectedCode === location.id ? " selected" : ""}`} aria-label={label} tabIndex={0} onMouseEnter={() => setActive(location.id)} onFocus={() => setActive(location.id)} onClick={() => { setActive(location.id); setSelectedCode(location.id); }} />;
      })}
    </svg>
    <div className="states-map-legend"><span>Not visited</span><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More rivers</span><small>River counts are unique by river name within each state.</small></div>
    <p className="map-attribution">State outlines: @svg-maps/usa, CC BY-NC 4.0.</p>
    <div className="state-river-list"><div className="panel-head"><div><span className="eyebrow">Selected state</span><h2>{selectedStateName || "Select a state"}</h2></div><span>{selectedList?.rivers.length ?? 0} rivers</span></div>
      {selectedList?.rivers.length ? <div className="state-river-rows"><div className="state-river-row head"><span>River</span><span>Trips</span><span>Miles</span><span>Latest outing</span><span /></div>{selectedList.rivers.map(river => <Link href={`/trips/${river.latestTripId}`} className="state-river-row" key={river.name}><strong>{river.name}</strong><span>{river.tripCount}</span><span>{river.totalMiles ? `${river.totalMiles.toLocaleString(undefined, { maximumFractionDigits: 1 })} mi` : "—"}</span><span>{river.latestDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${river.latestDate}T00:00:00Z`)) : "Date unknown"}</span><span aria-hidden="true">→</span></Link>)}</div> : <p className="muted state-river-empty">Click a visited state to see its rivers.</p>}
    </div>
  </section>;
}
