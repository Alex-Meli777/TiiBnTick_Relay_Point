import Link from "next/link";
import { Truck, Navigation, FileCheck } from "lucide-react";

export default function TrackingIndexPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Suivi de livraison</h1>
      <p className="mb-8 text-sm text-gray-500">
        Activez le suivi en tant que livreur ou consultez un lien partagé.
      </p>

      <div className="space-y-4">
        <Link
          href="/tracking/activate"
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Navigation className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Activer le suivi (livreur)</p>
            <p className="text-sm text-gray-500">
              Partagez votre position et générez un lien client
            </p>
          </div>
        </Link>

        <Link
          href="/tracking/proof"
          className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <FileCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">Preuve de livraison</p>
            <p className="text-sm text-gray-500">
              Photo, code OTP ou signature pour clôturer
            </p>
          </div>
        </Link>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
          <Truck className="mb-2 h-5 w-5 text-gray-400" />
          Le client reçoit un lien unique du type{" "}
          <code className="rounded bg-white px-1">/tracking/[token]</code> pour
          voir la carte en direct.
        </div>
      </div>
    </div>
  );
}
