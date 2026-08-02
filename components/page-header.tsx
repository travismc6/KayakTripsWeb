import { Search } from "lucide-react";
import Link from "next/link";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: { label: string; href: string } }) {
  return <header className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div><div className="header-actions"><Link className="header-search" href="/trips"><Search size={17} /> <span>Search trips</span><kbd>⌘ K</kbd></Link>{action && <Link className="button" href={action.href}>{action.label}</Link>}</div></header>;
}
