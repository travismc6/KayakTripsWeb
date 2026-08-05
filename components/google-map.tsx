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
          label: { text: point.kind === "start" ? "S" : point.kind === "end" ? "E" : poiSymbol(point.poiType), color: "#ffffff", fontSize: "12px", fontWeight: "700" }
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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="46" viewBox="0 0 34 46"><path fill="${color}" stroke="#fff" stroke-width="2" d="M17 1C8.2 1 1 8.2 1 17c0 12 16 27 16 27s16-15 16-27C33 8.2 25.8 1 17 1Z"/><circle cx="17" cy="17" r="9" fill="${color}"/></svg>`;
  return { url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`, labelOrigin: { x: 17, y: 17 } };
}

function poiColor(type?: string) {
  if (type === "hazard") return "#b42318";
  if (["waterfall", "swimming-hole"].includes(type || "")) return "#168aad";
  if (["campsite", "scenic-spot"].includes(type || "")) return "#5b7f3a";
  return "#7251a3";
}

function poiSymbol(type?: string) {
  return ({ campsite: "C", waterfall: "W", cave: "V", restroom: "R", "swimming-hole": "S", launch: "L", "take-out": "T", portage: "P", hazard: "!", parking: "P", "scenic-spot": "★", other: "•" } as Record<string, string>)[type || ""] || "•";
}

function formatPoiType(type?: string) { return (type || "Point of interest").split("-").map(word => word[0]?.toUpperCase() + word.slice(1)).join(" "); }

function geocode(geocoder: InstanceType<GoogleMaps["Geocoder"]>, address: string) {
  return new Promise<GeoLocation | null>(resolve => geocoder.geocode({ address }, (results, status) => resolve(status === "OK" && results?.[0] ? results[0].geometry.location : null)));
}

function delay(milliseconds: number) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
