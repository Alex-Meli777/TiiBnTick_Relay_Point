import Link from "next/link";
import { MapPin, Truck, Package, LayoutDashboard, ArrowRight } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Parcourir les points relais",
    description: "Carte interactive, recherche par proximité à Douala et Yaoundé.",
    href: "/relay-points",
  },
  {
    icon: Truck,
    title: "Suivre une livraison",
    description: "Lien de suivi en direct pour le client, activation GPS livreur.",
    href: "/tracking",
  },
  {
    icon: Package,
    title: "Devenir point relais",
    description: "Postulez pour rejoindre le réseau TiiBnTick.",
    href: "/relay-points/postuler",
  },
  {
    icon: LayoutDashboard,
    title: "Espace propriétaire",
    description: "Gérez votre point relais, colis et dépôts/retraits.",
    href: "/relay-dashboard",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-orange-500 to-orange-700 px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-3 text-3xl font-bold sm:text-4xl">TiiBnTick</h1>
          <p className="mb-2 text-lg text-orange-100">Module Point Relais</p>
          <p className="mx-auto mb-8 max-w-xl text-orange-100/90">
            Trouvez un point relais, suivez vos colis et gérez votre hub de
            livraison au Cameroun.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/relay-points"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-orange-700 hover:bg-orange-50"
            >
              Points relais
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Suivi livraison
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
