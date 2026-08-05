import { ArrowLeft, Clock3, Droplets, MapPin, Pencil, Route } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleMap, MapPoint } from "@/components/google-map";
import { TripPhotos } from "@/components/trip-photos";
import { TripPeople } from "@/components/trip-people";
import { TripComments } from "@/components/trip-comments";
import { getComments, getPeople, getPhotos, getTrip, getTripPeople } from "@/lib/api";
import { duration, formatDate, miles } from "@/lib/format";

export default async function TripPage({ params }: { params: { id: string } }) {
  const [trip, photos, people, tripPeople, comments] = await Promise.all([getTrip(params.id), getPhotos(params.id), getPeople(), getTripPeople(params.id), getComments(params.id)]); if (!trip) notFound();
  const routePoints: MapPoint[] = [];
  if (trip.startPoint || (trip.startLatitude != null && trip.startLongitude != null)) routePoints.push({ id: `${trip.id}-start`, tripId: trip.id, lat: trip.startLatitude ?? undefined, lng: trip.startLongitude ?? undefined, query: trip.startPoint ? `${trip.startPoint}, ${trip.riverName}, ${trip.states.join(", ") || "USA"}` : undefined, kind: "start", label: trip.startPoint || "Put-in", detail: `${trip.riverName} trip start` });
  if (trip.endPoint || (trip.endLatitude != null && trip.endLongitude != null)) routePoints.push({ id: `${trip.id}-end`, tripId: trip.id, lat: trip.endLatitude ?? undefined, lng: trip.endLongitude ?? undefined, query: trip.endPoint ? `${trip.endPoint}, ${trip.riverName}, ${trip.states.join(", ") || "USA"}` : undefined, kind: "end", label: trip.endPoint || "Take-out", detail: `${trip.riverName} trip end` });
  return <><div className="detail-top"><Link href="/trips"><ArrowLeft /> Back to trips</Link><div className="detail-actions"><Link className="button secondary" href={`/trips/${trip.id}/edit`}><Pencil /> Edit trip</Link></div></div>
    <header className="trip-hero"><div><span className="eyebrow">{trip.states.join(" · ") || "Trip detail"}</span><h1>{trip.name || trip.riverName}</h1><p>{trip.startPoint || "Unknown put-in"} <span>→</span> {trip.endPoint || "Unknown take-out"}</p></div><div className="trip-date"><span>Trip date</span><strong>{formatDate(trip)}</strong></div></header>
    <section className="detail-stats"><div><Route /><span>Distance<strong>{miles(trip.distanceMiles)}</strong></span></div><div><Clock3 /><span>Time on water<strong>{duration(trip.timeMinutes)}</strong></span></div><div><MapPin /><span>Route<strong>{trip.legs.length} {trip.legs.length === 1 ? "leg" : "legs"}</strong></span></div><div><Droplets /><span>Waterway<strong>{trip.riverName}</strong></span></div></section>
    <section className="panel trip-map-panel"><div className="panel-head"><div><span className="eyebrow">Put-in to take-out</span><h2>Trip map</h2></div></div><GoogleMap points={routePoints} connectRoute /></section>
    <TripPeople tripId={trip.id} people={people} initialAssignments={tripPeople} />
    <div className="detail-grid"><section className="panel detail-panel"><div className="panel-head"><div><span className="eyebrow">On the water</span><h2>Route details</h2></div></div>{trip.legs.length ? <div className="legs">{trip.legs.map((leg, i) => <div className="leg" key={leg.id}><span className="leg-dot">{i + 1}</span><div><strong>{leg.startPoint || "Unknown put-in"} → {leg.endPoint || "Unknown take-out"}</strong><p>{[miles(leg.distanceMiles), duration(leg.timeMinutes), leg.flowCfs ? `${leg.flowCfs.toLocaleString()} cfs` : null, leg.stageFeet ? `${leg.stageFeet} ft` : null].filter(x => x && x !== "—").join(" · ") || "No measurements recorded"}</p>{leg.notes && <small>{leg.notes}</small>}</div></div>)}</div> : <p className="muted">No route legs recorded.</p>}{trip.notes && <blockquote>“{trip.notes}”</blockquote>}</section>
      <TripPhotos tripId={trip.id} riverName={trip.riverName} initialPhotos={photos} />
    </div>
    <TripComments tripId={trip.id} initialComments={comments} />
  </>;
}
