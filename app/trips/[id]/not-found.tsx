import Link from "next/link";
export default function NotFound() { return <div className="empty-state"><span>404</span><h2>That trip drifted out of view.</h2><p>It may have been removed or the link is incomplete.</p><Link className="button" href="/trips">Back to trips</Link></div>; }
