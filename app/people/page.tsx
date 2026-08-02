import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "People" };
export default function PeoplePage() { return <><PageHeader eyebrow="Paddling crew" title="People make the miles matter." description="A home for paddlers, shared trips, and favorite river partners." /><section className="coming-soon"><div className="coming-art"><Users /></div><span className="eyebrow">API connection pending</span><h2>Your crew will show up here.</h2><p>The backend doesn’t publish people or trip-assignment endpoints yet. This view is ready for them when they land—without inventing data in the meantime.</p><div><span>01</span> Paddler profiles <i /><span>02</span> Trip assignments <i /><span>03</span> Shared history</div></section></>; }
