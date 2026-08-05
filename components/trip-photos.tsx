"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import { PhotoUpload } from "@/components/photo-upload";

const STORAGE_KEY = "kayaktrips-current-person";

export function TripPhotos({ tripId, riverName, initialPhotos }: { tripId: string; riverName: string; initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [personId, setPersonId] = useState("");
  useEffect(() => {
    const update = (event?: Event) => setPersonId(event instanceof CustomEvent ? event.detail : localStorage.getItem(STORAGE_KEY) || "");
    update();
    window.addEventListener("kayaktrips-person-changed", update);
    return () => window.removeEventListener("kayaktrips-person-changed", update);
  }, []);
  return <aside className="panel photo-panel">
    <div className="panel-head"><div><span className="eyebrow">Field notes</span><h2>Trip photos</h2></div>{personId && <PhotoUpload tripId={tripId} personId={personId} onUploaded={photo => setPhotos(current => [...current, photo])} />}</div>
    {photos.length ? <div className="photo-grid">{photos.map(photo => <figure key={photo.id}><Image src={photo.url} alt={photo.caption || `${riverName} trip`} fill sizes="(max-width: 800px) 50vw, 240px" />{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div> : <div className="photo-empty"><CameraIcon /><h3>No photos yet</h3><p>Add the first memory from this trip.</p></div>}
    {!personId && <p className="photo-login">Select a person under “Logged in as” to add a photo.</p>}
  </aside>;
}

function CameraIcon() { return <span className="camera-art"><span /></span>; }
