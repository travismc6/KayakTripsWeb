import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="KayakTrips dashboard">
    <span className="brand-mark" aria-hidden="true"><span /></span>
    {!compact && <span>Kayak<span>Trips</span></span>}
  </Link>;
}
