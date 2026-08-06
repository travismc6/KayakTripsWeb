"use client";

import { useEffect, useRef, useState } from "react";

export type MapPoint = { id: string; lat?: number; lng?: number; query?: string; label: string; detail: string; tripId: string; kind: "start" | "end" | "poi"; poiType?: string };
type GeoLocation = { lat: () => number; lng: () => number };
type GoogleMaps = { Map: new (element: HTMLElement, options: object) => { fitBounds: (bounds: object) => void }; Marker: new (options: object) => { addListener: (event: string, handler: () => void) => void }; InfoWindow: new (options: object) => { open: (options: object) => void }; LatLngBounds: new () => { extend: (point: { lat: number; lng: number } | GeoLocation) => void }; Polyline: new (options: object) => unknown; Geocoder: new () => { geocode: (request: { address: string }, callback: (results: Array<{ geometry: { location: GeoLocation } }> | null, status: string) => void) => void } };
declare global { interface Window { google?: { maps: GoogleMaps }; __kayakMapsLoading?: Promise<void> } }

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) return Promise.resolve();
  if (window.__kayakMapsLoading) return window.__kayakMapsLoading;
  window.__kayakMapsLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps could not be loaded"));
    document.head.appendChild(script);
  });
  return window.__kayakMapsLoading;
}

export function GoogleMap({ points, connectRoute = false }: { points: MapPoint[]; connectRoute?: boolean }) {
  const element = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  useEffect(() => {
    if (!apiKey || !element.current || !points.length) return;
    let cancelled = false;
    loadGoogleMaps(apiKey).then(() => {
      if (cancelled || !element.current || !window.google) return;
      const maps = window.google.maps;
      const map = new maps.Map(element.current, { center: { lat: 39.5, lng: -98.35 }, zoom: 4, mapTypeControl: false, streetViewControl: false, fullscreenControl: true });
      const bounds = new maps.LatLngBounds();
      let markerCount = 0;
      const addMarker = (point: MapPoint, position: { lat: number; lng: number } | GeoLocation) => {
        bounds.extend(position);
        markerCount++;
        const marker = new maps.Marker({
          map,
          position,
          title: `${point.kind === "start" ? "Trip start" : point.kind === "end" ? "Trip end" : point.poiType || "Point of interest"}: ${point.label}`,
          icon: markerIcon(point.kind, point.poiType),
          label: undefined
        });
        const info = new maps.InfoWindow({ content: `<div class="map-popup"><strong>${escapeHtml(point.label)}</strong><br>${escapeHtml(point.detail)}<br><a href="/trips/${point.tripId}">View trip</a></div>` });
        marker.addListener("click", () => info.open({ map, anchor: marker }));
      };
      const exact = points.filter(point => point.lat != null && point.lng != null);
      exact.forEach(point => addMarker(point, { lat: point.lat!, lng: point.lng! }));
      const route = exact.filter(point => point.kind !== "poi");
      if (connectRoute && route.length > 1) new maps.Polyline({ map, path: route.map(point => ({ lat: point.lat!, lng: point.lng! })), strokeColor: "#0f6370", strokeOpacity: .9, strokeWeight: 4 });
      const unresolved = points.filter(point => (point.lat == null || point.lng == null) && point.query);
      const geocoder = new maps.Geocoder();
      void (async () => {
        for (const point of unresolved) {
          if (cancelled) return;
          const position = await geocode(geocoder, point.query!);
          if (position) addMarker(point, position);
          await delay(45);
        }
        if (markerCount) map.fitBounds(bounds);
      })();
    }).catch(() => setError("Google Maps could not be loaded. Check the browser API key and its allowed domains."));
    return () => { cancelled = true; };
  }, [apiKey, connectRoute, points]);

  if (!points.length) return <div className="map-empty"><h3>No mapped coordinates yet</h3><p>Locations will appear here once coordinates are recorded.</p></div>;
  if (!apiKey || error) return <div className="map-fallback"><div><h3>{error || "Add a Google Maps key to turn on the interactive map"}</h3><p>Set <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>. Your recorded locations are still available below.</p></div><div className="map-place-list">{points.map(point => <a key={point.id} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.lat != null && point.lng != null ? `${point.lat},${point.lng}` : point.query || point.label)}`} target="_blank" rel="noreferrer"><span>{point.kind === "start" ? "Start" : point.kind === "end" ? "End" : formatPoiType(point.poiType)}</span><strong>{point.label}</strong><small>{point.detail}</small></a>)}</div></div>;
  return <div ref={element} className="google-map" aria-label="Kayaking locations on Google Maps" />;
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] || char)); }

function markerIcon(kind: MapPoint["kind"], poiType?: string) {
  const color = kind === "start" ? "#2f855a" : kind === "end" ? "#d65f4a" : poiColor(poiType);
  const glyph = kind === "start" ? kayakGlyph() : kind === "end" ? finishGlyph() : poiGlyph(poiType);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="50" viewBox="0 0 38 50"><path fill="${color}" stroke="#fff" stroke-width="2" d="M19 1C9.1 1 1 9.1 1 19c0 13.5 18 29 18 29s18-15.5 18-29C37 9.1 28.9 1 19 1Z"/><circle cx="19" cy="19" r="11" fill="${color}"/>${glyph}</svg>`;
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, labelOrigin: { x: 19, y: 19 } };
}

function kayakGlyph() {
  return `<path fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M10 21c3.2 3.5 14.8 3.5 18 0-5.2-2.3-12.8-2.3-18 0zM12 14l14 10M10.5 12.5l3 3M24.5 22.5l3 3"/><circle cx="19" cy="20" r="1.5" fill="#fff"/>`;
}

function finishGlyph() {
  return `<path fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M13 27V11M14 12h12v9H14"/><path fill="#fff" d="M14 12h4v3h-4zm8 0h4v3h-4zm-4 3h4v3h-4zm-4 3h4v3h-4zm8 0h4v3h-4z"/>`;
}

function poiColor(type?: string) {
  if (type === "hazard") return "#b42318";
  if (["waterfall", "swimming-hole"].includes(type || "")) return "#168aad";
  if (["campsite", "scenic-spot"].includes(type || "")) return "#5b7f3a";
  return "#7251a3";
}

function poiGlyph(type?: string) {
  const stroke = `fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  const glyphs: Record<string, string> = {
    campsite: `<path ${stroke} d="M12 24l7-12 7 12M15 24l4-7 4 7M11 24h16"/>`,
    waterfall: `<path ${stroke} d="M13 12h12M15 12v7c0 3-2 3-2 6M19 12v8c0 3 2 3 2 6M23 12v6c0 3 2 3 2 6"/>`,
    cave: `<path ${stroke} d="M10 25l5-12h8l5 12M15 25v-4a4 4 0 018 0v4"/>`,
    restroom: `<path fill="#fff" d="M14.2 17.4c.4-2.1 2.1-3.4 4.3-3.5-.7-.8-.8-1.8-.3-2.9 2.4.5 4 2.1 4 4.1 0 .5-.1 1-.3 1.4 2.2.2 3.8 1.7 4 3.7 1.4.5 2.4 1.8 2.4 3.3 0 2-1.6 3.5-3.7 3.5H13.3c-2.1 0-3.7-1.5-3.7-3.5 0-1.6 1.1-3 2.7-3.4.1-1.2.8-2.2 1.9-2.7Z"/>`,
    "swimming-hole": `<path ${stroke} d="M10 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0M10 22c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>`,
    launch: `<path ${stroke} d="M11 24l15-10M13 13l3 4M23 21l3 4"/>`,
    "take-out": `<path ${stroke} d="M11 24l15-10M13 13l3 4M23 21l3 4"/>`,
    portage: `<path ${stroke} d="M11 22h16M13 18l3 4-3 4M25 18l-3 4 3 4"/>`,
    hazard: `<path ${stroke} d="M19 11l9 16H10zM19 16v5M19 24h.01"/>`,
    parking: `<text x="19" y="25" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="17" font-weight="700">P</text>`,
    "scenic-spot": `<path ${stroke} d="M19 10l2.5 5.5 6 .6-4.5 4 1.3 5.9-5.3-3-5.3 3 1.3-5.9-4.5-4 6-.6z"/>`,
    other: `<circle cx="19" cy="19" r="3" fill="#fff"/>`
  };
  return glyphs[type || ""] || glyphs.other;
}

function formatPoiType(type?: string) { return (type || "Point of interest").split("-").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" "); }

function geocode(geocoder: InstanceType<GoogleMaps["Geocoder"]>, address: string) {
  return new Promise<GeoLocation | null>(resolve => geocoder.geocode({ address }, (results, status) => resolve(status === "OK" && results?.[0] ? results[0].geometry.location : null)));
}

function delay(milliseconds: number) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
