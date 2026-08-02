import { ArrowRight, CalendarDays, ChevronRight, Compass, MapPin, Route } from "lucide-react";
import Link from "next/link";
import { GoogleMap, MapPoint } from "@/components/google-map";
import { PageHeader } from "@/components/page-header";
import { YearChart } from "@/components/year-chart";
import { getTrips } from "@/lib/api";
import { formatDate, miles, tripYear } from "@/lib/format";

export default async function Dashboard() {
  const trips = await getTrips();
  const dated = trips.filter(t => t.startDate).sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
  const recent = dated.slice(0, 5);
  const totalMiles = trips.reduce((sum, t) => sum + (t.distanceMiles || 0), 0);
  const currentYear = new Date().getFullYear();
  const years = new Map<number, { year: number; miles: number; trips: number }>();
  trips.forEach(t => { const year = tripYear(t); if (!year) return; const item = years.get(year) || { year, miles: 0, trips: 0 }; item.trips++; item.miles += t.distanceMiles || 0; years.set(year, item); });
  const byYear = [...years.values()].sort((a,b) => a.year - b.year);
  const stateCounts = new Map<string, number>();
  trips.forEach(t => t.state && stateCounts.set(t.state, (stateCounts.get(t.state) || 0) + 1));
  const favorite = [...stateCounts].sort((a,b) => b[1]-a[1])[0];
  const startPoints: MapPoint[] = trips.filter(trip => trip.startPoint || (trip.startLatitude != null && trip.startLongitude != null)).map(trip => ({ id: `${trip.id}-start`, tripId: trip.id, lat: trip.startLatitude ?? undefined, lng: trip.startLongitude ?? undefined, query: trip.startPoint ? `${trip.startPoint}, ${trip.riverName}, ${trip.state || "USA"}` : undefined, kind: "start", label: trip.startPoint || `${trip.riverName} put-in`, detail: `${trip.riverName} · ${formatDate(trip)}` }));
  return <>
    <PageHeader eyebrow="Paddling log" title="Good to have you back." description="Here’s the story your time on the water is telling." action={{ label: "Import trips", href: "/import" }} />
    <section className="stat-grid">
      <article className="stat-card river"><div className="stat-icon"><Compass /></div><span>Total trips</span><strong>{trips.length}</strong><small>adventures logged</small></article>
      <article className="stat-card green"><div className="stat-icon"><Route /></div><span>Miles paddled</span><strong>{Math.round(totalMiles).toLocaleString()}</strong><small>lifetime distance</small></article>
      <article className="stat-card amber"><div className="stat-icon"><CalendarDays /></div><span>Trips this year</span><strong>{years.get(currentYear)?.trips || 0}</strong><small>{currentYear} season</small></article>
      <article className="stat-card coral"><div className="stat-icon"><MapPin /></div><span>Favorite state</span><strong>{favorite?.[0] || "—"}</strong><small>{favorite ? `${favorite[1]} trips logged` : "keep exploring"}</small></article>
    </section>
    <section className="panel dashboard-map-panel">
      <div className="panel-head"><div><span className="eyebrow">Paddling atlas</span><h2>Every put-in</h2></div><Link href="/map">Open full map <ArrowRight size={16} /></Link></div>
      <GoogleMap points={startPoints} />
      <div className="dashboard-map-foot"><span><MapPin size={14} /> {startPoints.length} start {startPoints.length === 1 ? "location" : "locations"}</span><small>Named locations are approximate until exact coordinates are saved</small></div>
    </section>
    <section className="dashboard-grid">
      <article className="panel recent-panel"><div className="panel-head"><div><span className="eyebrow">Latest outings</span><h2>Recent trips</h2></div><Link href="/trips">View all <ArrowRight size={16} /></Link></div>
        <div className="trip-list">{recent.map((trip, index) => <Link href={`/trips/${trip.id}`} className="trip-row" key={trip.id}><span className="trip-number">{String(index + 1).padStart(2,"0")}</span><div className="trip-main"><strong>{trip.riverName}</strong><span>{trip.startPoint || "Put-in not recorded"}{trip.endPoint ? ` → ${trip.endPoint}` : ""}</span></div><div className="trip-meta"><strong>{miles(trip.distanceMiles)}</strong><span>{formatDate(trip)}</span></div><span className="state-pill">{trip.state || "—"}</span><ChevronRight size={18} /></Link>)}</div>
      </article>
      <article className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">Year over year</span><h2>Miles on the water</h2></div><span className="chart-legend"><i /> Miles</span></div><YearChart data={byYear} /></article>
    </section>
    <section className="insight-strip"><div><span className="eyebrow light">Your logbook</span><h2>{years.size} seasons of stories.</h2><p>From quick evening laps to all-day river runs, every mile has a place here.</p></div><div className="insight-stats"><span><strong>{new Set(trips.map(t => t.riverName)).size}</strong> waterways</span><span><strong>{stateCounts.size}</strong> states</span><span><strong>{trips.filter(t => !t.startDate).length}</strong> dates to refine</span></div></section>
  </>;
}
