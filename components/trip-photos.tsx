"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Photo } from "@/lib/types";
import { PhotoUpload } from "@/components/photo-upload";

const STORAGE_KEY = "kayaktrips-current-person";

export function TripPhotos({ tripId, riverName, initialPhotos }: { tripId: string; riverName: string; initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [personId, setPersonId] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  useEffect(() => {
    const update = (event?: Event) => setPersonId(event instanceof CustomEvent ? event.detail : localStorage.getItem(STORAGE_KEY) || "");
    update();
    window.addEventListener("kayaktrips-person-changed", update);
    return () => window.removeEventListener("kayaktrips-person-changed", update);
  }, []);
  useEffect(() => {
    if (!selectedPhoto) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedPhoto(null); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", close); };
  }, [selectedPhoto]);
  return <aside className="panel photo-panel">
    <div className="panel-head"><div><span className="eyebrow">Field notes</span><h2>Trip photos</h2></div>{personId && <PhotoUpload tripId={tripId} personId={personId} onUploaded={photo => setPhotos(current => [...current, photo])} />}</div>
    {photos.length ? <div className="photo-grid">{photos.map(photo => <figure key={photo.id}><button type="button" className="photo-open" onClick={() => setSelectedPhoto(photo)} aria-label={`Enlarge ${photo.caption || `${riverName} trip photo`}`}><Image src={photo.url} alt={photo.caption || `${riverName} trip`} fill sizes="(max-width: 800px) 50vw, 240px" /></button>{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}</div> : <div className="photo-empty"><CameraIcon /><h3>No photos yet</h3><p>Add the first memory from this trip.</p></div>}
    {!personId && <p className="photo-login">Select a person under “Logged in as” to add a photo.</p>}
    {selectedPhoto && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged trip photo" onMouseDown={event => { if (event.target === event.currentTarget) setSelectedPhoto(null); }}>
      <button type="button" className="photo-lightbox-close" onClick={() => setSelectedPhoto(null)} aria-label="Close enlarged photo"><X /></button>
      <figure><div className="photo-lightbox-image"><Image src={selectedPhoto.url} alt={selectedPhoto.caption || `${riverName} trip`} fill sizes="95vw" priority /></div>{selectedPhoto.caption && <figcaption>{selectedPhoto.caption}</figcaption>}</figure>
    </div>}
  </aside>;
}

function CameraIcon() { return <span className="camera-art"><span /></span>; }
