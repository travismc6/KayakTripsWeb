import { ImportFlow } from "@/components/import-flow";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Import trips" };
export default function ImportPage() { return <><PageHeader eyebrow="Bring your history" title="Import your trip log." description="Preview every row before anything is added. Messy dates and uncertain details stay visible." /><ImportFlow /></>; }
