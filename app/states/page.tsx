import { PageHeader } from "@/components/page-header";
import { StatesVisitedMap } from "@/components/states-visited-map";
import { getTrips } from "@/lib/api";

export const metadata = { title: "States visited" };

export default async function StatesPage() {
  const trips = await getTrips();
  const riversByState = new Map<string, Set<string>>();
  for (const trip of trips) {
    if (!trip.state) continue;
    const state = trip.state.toUpperCase();
    const rivers = riversByState.get(state) ?? new Set<string>();
    rivers.add(trip.riverName.trim());
    riversByState.set(state, rivers);
  }
  const states = [...riversByState].map(([code, rivers]) => ({ code, rivers: [...rivers].sort() }));
  return <><PageHeader eyebrow="Paddling footprint" title="States you’ve explored." description={`${states.length} visited ${states.length === 1 ? "state" : "states"}, shaded by the number of distinct rivers in your log.`} /><StatesVisitedMap states={states} /></>;
}
