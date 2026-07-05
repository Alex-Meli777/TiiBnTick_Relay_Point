"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  History,
  LogOut,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/relay-dashboard", label: "Mon point relais", icon: MapPin },
  { href: "/relay-dashboard", label: "Colis en stock", icon: Package, hash: "stock" },
  { href: "/relay-dashboard", label: "Historique", icon: History, hash: "history" },
];

export default function RelayDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/relay-auth/login", { method: "DELETE" });
    router.push("/relay-auth/login");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Gestionnaire
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.hash ? `${item.href}#${item.hash}` : item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-700",
                  pathname === item.href && "bg-orange-50 text-orange-700"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </aside>

        <div className="flex-1 pb-20 md:pb-8">{children}</div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.hash ? `${item.href}#${item.hash}` : item.href}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-gray-500"
          >
            <item.icon className="h-5 w-5" />
            {item.label.split(" ")[0]}
          </Link>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-gray-500"
        >
          <LayoutDashboard className="h-5 w-5" />
          Quitter
        </button>
      </nav>
    </div>
  );
}
