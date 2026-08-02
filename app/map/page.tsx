import { GoogleMap, MapPoint } from "@/components/google-map";
import { PageHeader } from "@/components/page-header";
import { getTrips } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Map" };

export default async function MapPage() {
  const trips = await getTrips();
  const points: MapPoint[] = trips.flatMap(trip => {
    const detail = `${trip.riverName} · ${formatDate(trip)}`;
    const result: MapPoint[] = [];
    if (trip.startPoint || (trip.startLatitude != null && trip.startLongitude != null)) result.push({ id: `${trip.id}-start`, tripId: trip.id, lat: trip.startLatitude ?? undefined, lng: trip.startLongitude ?? undefined, query: trip.startPoint ? `${trip.startPoint}, ${trip.riverName}, ${trip.state || "USA"}` : undefined, kind: "start", label: trip.startPoint || `${trip.riverName} put-in`, detail });
    if (trip.endPoint || (trip.endLatitude != null && trip.endLongitude != null)) result.push({ id: `${trip.id}-end`, tripId: trip.id, lat: trip.endLatitude ?? undefined, lng: trip.endLongitude ?? undefined, query: trip.endPoint ? `${trip.endPoint}, ${trip.riverName}, ${trip.state || "USA"}` : undefined, kind: "end", label: trip.endPoint || `${trip.riverName} take-out`, detail });
    return result;
  });
  const mappedTrips = new Set(points.map(point => point.tripId)).size;
  return <><PageHeader eyebrow="Paddling atlas" title="Every place you’ve put a boat in." description={`${points.length} named put-ins and take-outs across ${mappedTrips} trips. Locations without saved coordinates are approximated by Google Maps.`} /><section className="map-panel"><GoogleMap points={points} /><div className="map-legend"><span><i className="start" /> Put-in</span><span><i className="end" /> Take-out</span><small>Click a marker to open its trip.</small></div></section></>;
}
