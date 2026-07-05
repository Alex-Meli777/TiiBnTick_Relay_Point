"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { submitProofOfDelivery } from "@/services/handoverService";
import { CustomInput } from "@/components/ui/CustomInput";
import { useToast } from "@/components/ui/Toast";

export default function ProofOfDeliveryPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    trackingNumber: "TBT-CM-2026-00003",
    otpCode: "",
    signature: "",
    submittedBy: "livreur-demo",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await submitProofOfDelivery({
        trackingNumber: form.trackingNumber,
        otpCode: form.otpCode || undefined,
        signature: form.signature || undefined,
        submittedBy: form.submittedBy,
      });
      toast("Preuve soumise — suivi clôturé", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Erreur de soumission",
        "error"
      );
    } finally {
      setLoading(false);
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

      <h1 className="mb-2 text-xl font-bold">Preuve de livraison</h1>
      <p className="mb-6 text-sm text-gray-500">
        Soumettez une photo, un code ou une signature pour clôturer la livraison.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
      >
        <CustomInput
          label="Numéro de suivi"
          required
          value={form.trackingNumber}
          onChange={(e) =>
            setForm((f) => ({ ...f, trackingNumber: e.target.value }))
          }
        />
        <CustomInput
          label="Code OTP"
          value={form.otpCode}
          onChange={(e) => setForm((f) => ({ ...f, otpCode: e.target.value }))}
          hint="Optionnel si signature fournie"
        />
        <CustomInput
          label="Signature"
          value={form.signature}
          onChange={(e) =>
            setForm((f) => ({ ...f, signature: e.target.value }))
          }
          placeholder="Initiales du destinataire"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Photo (optionnel)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                /* photoBase64 could be sent — mock accepts without */
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Soumettre la preuve"}
        </button>
      </form>
    </div>
  );
}
