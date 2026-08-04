"use client";

import usa from "@svg-maps/usa";
import { useMemo, useState } from "react";

type StateRivers = { code: string; rivers: string[] };
type StateLocation = { id: string; name: string; path: string };
const map = usa as { viewBox: string; locations: StateLocation[] };

export function StatesVisitedMap({ states }: { states: StateRivers[] }) {
  const data = useMemo(() => new Map(states.map(state => [state.code.toLowerCase(), state])), [states]);
  const max = Math.max(1, ...states.map(state => state.rivers.length));
  const initial = [...states].sort((a, b) => b.rivers.length - a.rivers.length)[0]?.code.toLowerCase() ?? null;
  const [active, setActive] = useState<string | null>(initial);
  const selected = active ? data.get(active) : undefined;
  const stateName = active ? map.locations.find(location => location.id === active)?.name : null;

  return <section className="panel states-map-panel">
    <div className="states-map-summary" aria-live="polite">
      {selected ? <><strong>{stateName}</strong><span>{selected.rivers.length} distinct {selected.rivers.length === 1 ? "river" : "rivers"}</span><small>{selected.rivers.join(" · ")}</small></> : <><strong>Explore the map</strong><span>Hover or focus a visited state</span></>}
    </div>
    <svg className="states-map" viewBox={map.viewBox} role="img" aria-label="Map of visited U.S. states shaded by distinct river count">
      {map.locations.map(location => {
        const item = data.get(location.id);
        const level = item ? Math.max(1, Math.ceil(item.rivers.length / max * 4)) : 0;
        const label = item ? `${location.name}: ${item.rivers.length} distinct ${item.rivers.length === 1 ? "river" : "rivers"}` : `${location.name}: not visited`;
        return <path key={location.id} d={location.path} className={`state-shape level-${level}${active === location.id ? " active" : ""}`} aria-label={label} tabIndex={0} onMouseEnter={() => setActive(location.id)} onFocus={() => setActive(location.id)} onClick={() => setActive(location.id)} />;
      })}
    </svg>
    <div className="states-map-legend"><span>Not visited</span><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More rivers</span><small>River counts are unique by river name within each state.</small></div>
    <p className="map-attribution">State outlines: @svg-maps/usa, CC BY-NC 4.0.</p>
  </section>;
}
