import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/fraunces/600.css";
import "./globals.css";
import "./maps.css";
import "./edit.css";
import "./states.css";
import { Sidebar } from "@/components/sidebar";

export const metadata = { title: { default: "KayakTrips", template: "%s · KayakTrips" }, description: "A living log of every river, lake, and mile." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Sidebar /><main className="main">{children}</main></body></html>;
}
