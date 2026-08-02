import { TripSummary } from "./types";

export function formatDate(trip: Pick<TripSummary, "startDate" | "sourceDateText">, short = false) {
  if (trip.startDate) return new Intl.DateTimeFormat("en-US", short ? { month: "short", year: "numeric" } : { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${trip.startDate}T00:00:00Z`));
  return trip.sourceDateText || "Date unknown";
}

export const miles = (value: number | null) => value == null ? "—" : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)} mi`;

export function duration(value: number | null) {
  if (!value) return "—";
  const hours = Math.floor(value / 60), minutes = value % 60;
  return hours ? `${hours}h${minutes ? ` ${minutes}m` : ""}` : `${minutes}m`;
}

export const tripYear = (trip: TripSummary) => trip.startDate ? Number(trip.startDate.slice(0, 4)) : null;
