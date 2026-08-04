"use client";

import { BarChart3, Download, Map, MapPinned, Menu, Route, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";

const nav = [
  ["/", "Dashboard", BarChart3],
  ["/trips", "Trips", Map],
  ["/map", "Map", MapPinned],
  ["/states", "States", Route],
  ["/people", "People", Users],
  ["/import", "Import", Download],
] as const;

export function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return <>
    <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
    {open && <button className="nav-scrim" onClick={() => setOpen(false)} aria-label="Close menu" />}
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-top"><Brand /><button className="close-menu" onClick={() => setOpen(false)}><X /></button></div>
      <nav>{nav.map(([href, label, Icon]) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return <Link key={href} href={href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon size={19} />{label}</Link>;
      })}</nav>
      <div className="sidebar-foot"><div className="current-user">MC</div><div><strong>My paddling log</strong><span>Personal workspace</span></div></div>
    </aside>
  </>;
}
