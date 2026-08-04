"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Comment } from "@/lib/types";

const STORAGE_KEY = "kayaktrips-current-person";

export function TripComments({ tripId, initialComments }: { tripId: string; initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [personId, setPersonId] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const update = (event?: Event) => setPersonId(event instanceof CustomEvent ? event.detail : localStorage.getItem(STORAGE_KEY) || "");
    update();
    window.addEventListener("kayaktrips-person-changed", update);
    return () => window.removeEventListener("kayaktrips-person-changed", update);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      const response = await fetch(`/api/trips/${tripId}/comments`, { method: "POST", headers: { "content-type": "application/json", "x-kayaktrips-person-id": personId }, body: JSON.stringify({ body }) });
      if (!response.ok) { const result = await response.json().catch(() => null); throw new Error(result?.message || result || "Could not add comment."); }
      const comment: Comment = await response.json();
      setComments(current => [...current, comment]); setBody("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add comment."); }
    finally { setSaving(false); }
  }

  return <section className="panel comments-panel">
    <div className="panel-head"><div><span className="eyebrow">Conversation</span><h2>Comments</h2></div><MessageCircle /></div>
    <div className="comments-list">{comments.length ? comments.map(comment => <article className="comment" key={comment.id}><span className="comment-avatar">{initials(comment.authorName)}</span><div><div className="comment-meta"><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>{formatTime(comment.createdAt)}</time></div><p>{comment.body}</p></div></article>) : <p className="comments-empty">No comments yet. Start the conversation.</p>}</div>
    {personId ? <form className="comment-form" onSubmit={submit}><textarea value={body} onChange={event => setBody(event.target.value)} placeholder="Add a comment about this trip…" maxLength={2000} required /><div><span>{body.length.toLocaleString()} / 2,000</span><button className="button" disabled={saving || !body.trim()}>{saving ? "Posting…" : <><Send /> Post comment</>}</button></div>{error && <p className="comment-error">{error}</p>}</form> : <p className="comment-login">Select a person under “Logged in as” to add a comment.</p>}
  </section>;
}

function initials(name: string) { return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase(); }
function formatTime(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
