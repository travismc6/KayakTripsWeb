import { PageHeader } from "@/components/page-header";
import { StatesVisitedMap } from "@/components/states-visited-map";
import { getTrips } from "@/lib/api";

export const metadata = { title: "States visited" };

export default async function StatesPage() {
  const trips = await getTrips();
  const riversByState = new Map<string, Map<string, { tripCount: number; totalMiles: number; latestDate: string | null; latestTripId: string }>>();
  for (const trip of trips) {
    if (!trip.state) continue;
    const state = trip.state.toUpperCase();
    const rivers = riversByState.get(state) ?? new Map();
    const name = trip.riverName.trim();
    const river = rivers.get(name) ?? { tripCount: 0, totalMiles: 0, latestDate: null, latestTripId: trip.id };
    river.tripCount++; river.totalMiles += trip.distanceMiles ?? 0;
    if (trip.startDate && (!river.latestDate || trip.startDate > river.latestDate)) { river.latestDate = trip.startDate; river.latestTripId = trip.id; }
    rivers.set(name, river);
    riversByState.set(state, rivers);
  }
  const states = [...riversByState].map(([code, rivers]) => ({ code, rivers: [...rivers].map(([name, details]) => ({ name, ...details })).sort((a, b) => a.name.localeCompare(b.name)) }));
  return <><PageHeader eyebrow="Paddling footprint" title="States you’ve explored." description={`${states.length} visited ${states.length === 1 ? "state" : "states"}, shaded by the number of distinct rivers in your log.`} /><StatesVisitedMap states={states} /></>;
}
