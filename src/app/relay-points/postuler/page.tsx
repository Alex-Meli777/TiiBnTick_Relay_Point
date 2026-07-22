import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ApplyRelayPointForm from "@/components/relay/ApplyRelayPointForm";

export default function PostulerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link
        href="/relay-points"
        className="mb-4 inline-flex items-center gap-1 text-sm text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Devenir point relais</h1>
      <p className="mb-6 text-sm text-gray-500">
        Postulez pour rejoindre le réseau TiiBnTick. Aucune connexion requise.
      </p>
      <ApplyRelayPointForm />
    </div>
  );
}
