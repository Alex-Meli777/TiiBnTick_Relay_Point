"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Navigation } from "lucide-react";
import { activateDeliveryTracking } from "@/services/handoverService";
import { getDeviceLocation } from "@/lib/geocoding";
import { CustomInput } from "@/components/ui/CustomInput";
import { useToast } from "@/components/ui/Toast";

export default function TrackingActivatePage() {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState("TBT-CM-2026-00003");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const loc = await getDeviceLocation();
      const session = await activateDeliveryTracking({
        trackingNumber,
        driverLatitude: loc.latitude,
        driverLongitude: loc.longitude,
      });
      const url = `${window.location.origin}/tracking/${session.shareToken}`;
      setShareUrl(url);
      toast("Suivi activé — lien généré", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Activation échouée",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePosition() {
    if (!shareUrl) return;
    const token = shareUrl.split("/").pop();
    if (!token) return;
    try {
      const loc = await getDeviceLocation();
      await fetch(`/api/tracking/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: loc.latitude,
          longitude: loc.longitude,
        }),
      });
      toast("Position mise à jour", "success");
    } catch {
      toast("Erreur mise à jour position", "error");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/tracking"
        className="mb-4 inline-flex items-center gap-1 text-sm text-orange-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mb-2 text-xl font-bold">Activer le suivi livraison</h1>
      <p className="mb-6 text-sm text-gray-500">
        En tant que livreur, partagez votre position GPS au client.
      </p>

      <form
        onSubmit={handleActivate}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <CustomInput
          label="Numéro de suivi"
          required
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="TBT-CM-2026-00003"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
        >
          <Navigation className="h-4 w-4" />
          {loading ? "Activation..." : "Activer et partager ma position"}
        </button>
      </form>

      {shareUrl && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-medium text-green-800">
            Lien de suivi client :
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-green-200 bg-white px-3 py-2 text-xs"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast("Lien copié", "success");
              }}
              className="rounded-lg bg-green-600 p-2 text-white"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleUpdatePosition}
            className="mt-3 w-full rounded-xl border border-green-300 py-2 text-sm font-medium text-green-800"
          >
            Mettre à jour ma position
          </button>
        </div>
      )}
    </div>
  );
}
