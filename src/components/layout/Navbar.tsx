import Link from "next/link";
import { Package, MapPin, Truck, LayoutDashboard } from "lucide-react";

const navLinks = [
  { href: "/relay-points", label: "Points relais", icon: MapPin },
  { href: "/tracking", label: "Suivi livraison", icon: Truck },
  { href: "/relay-points/postuler", label: "Devenir point relais", icon: Package },
  { href: "/relay-dashboard", label: "Espace gestionnaire", icon: LayoutDashboard },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">TiiBnTick</span>
            <span className="ml-1 text-xs text-gray-500">Points relais</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
