import { GoogleMap, MapPoint } from "@/components/google-map";
import { PageHeader } from "@/components/page-header";
import { getTrips } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Map" };

export default async function MapPage() {
  const trips = await getTrips();
  const points: MapPoint[] = trips.flatMap(trip => {
    const detail = `${trip.riverName} · ${formatDate(trip)}`;
    if (!trip.startPoint && (trip.startLatitude == null || trip.startLongitude == null)) return [];
    return [{ id: `${trip.id}-start`, tripId: trip.id, lat: trip.startLatitude ?? undefined, lng: trip.startLongitude ?? undefined, query: trip.startPoint ? `${trip.startPoint}, ${trip.riverName}, ${trip.state || "USA"}` : undefined, kind: "start" as const, label: trip.startPoint || `${trip.riverName} put-in`, detail }];
  });
  const mappedTrips = new Set(points.map(point => point.tripId)).size;
  return <><PageHeader eyebrow="Paddling atlas" title="Every place you’ve put a boat in." description={`${points.length} put-ins across ${mappedTrips} trips. Locations without saved coordinates are approximated by Google Maps.`} /><section className="map-panel"><GoogleMap points={points} /><div className="map-legend"><span><i className="start" /> Put-in</span><small>Click a marker to open its trip.</small></div></section></>;
}
