import { Person, Photo, TripDetail, TripPerson, TripSummary } from "./types";

export const API_URL = process.env.KAYAKTRIPS_API_URL ?? "https://kayaktripsapi-production.up.railway.app";

async function api<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    return response.json();
  } catch (error) {
    console.error(`KayakTrips request failed: ${path}`, error);
    return fallback;
  }
}

export const getTrips = () => api<TripSummary[]>("/api/trips", []);
export const getTrip = (id: string) => api<TripDetail | null>(`/api/trips/${id}`, null);
export const getPhotos = (id: string) => api<Photo[]>(`/api/trips/${id}/photos`, []);
export const getPeople = () => api<Person[]>("/api/people", []);
export const getTripPeople = (id: string) => api<TripPerson[]>(`/api/trips/${id}/people`, []);
