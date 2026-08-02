import { PageHeader } from "@/components/page-header";
import { TripsBrowser } from "@/components/trips-browser";
import { getTrips } from "@/lib/api";

export const metadata = { title: "Trips" };
export default async function TripsPage() { const trips = await getTrips(); return <><PageHeader eyebrow="The logbook" title="Every trip, one current." description="Search the routes you’ve run and revisit the details worth remembering." action={{ label: "Import trips", href: "/import" }} /><TripsBrowser trips={trips} /></>; }
