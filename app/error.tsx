"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="empty-state"><span>!</span><h2>The current got rough.</h2><p>We couldn’t load this view from the trip log.</p><button className="button" onClick={reset}>Try again</button></div>; }
