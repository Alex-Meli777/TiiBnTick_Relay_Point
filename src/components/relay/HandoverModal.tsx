"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { RelayParcelEntry } from "@/types/relayPoint";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { depositParcel, pickupParcel } from "@/services/handoverService";
import { useToast } from "@/components/ui/toast";

export type HandoverMode = "deposit" | "pickup";

interface HandoverModalProps {
  parcel: RelayParcelEntry | null;
  mode: HandoverMode | null;
  relayPointId: string;
  driverId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const verificationOptions = [
  { value: "qr_scan", label: "Scan QR" },
  { value: "otp_code", label: "Code OTP" },
  { value: "manual_id_check", label: "Vérification ID manuelle" },
];

export default function HandoverModal({
  parcel,
  mode,
  relayPointId,
  driverId = "drv-dashboard",
  onClose,
  onSuccess,
}: HandoverModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    parcel?.trackingNumber ?? ""
  );
  const [verificationMethod, setVerificationMethod] = useState<
    "qr_scan" | "otp_code" | "manual_id_check"
  >("qr_scan");
  const [verificationReference, setVerificationReference] = useState("");
  const [recipientOtp, setRecipientOtp] = useState("");

  if (!mode) return null;

  const activeTracking = trackingNumber || parcel?.trackingNumber || "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTracking) return;
    setLoading(true);

    try {
      if (mode === "deposit") {
        await depositParcel({
          trackingNumber: activeTracking,
          relayPointId,
          driverId,
          verificationMethod,
          verificationReference: verificationReference || undefined,
        });
        toast("Dépôt enregistré avec succès", "success");
      } else {
        await pickupParcel({
          trackingNumber: activeTracking,
          relayPointId,
          recipientOtp,
        });
        toast("Retrait confirmé", "success");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Opération échouée",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {mode === "deposit" ? "Enregistrer un dépôt" : "Confirmer un retrait"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!parcel && (
            <CustomInput
              label="Numéro de suivi"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="TBT-CM-2026-00003"
            />
          )}

          {parcel && (
            <p className="font-mono text-sm text-orange-600">
              {parcel.trackingNumber}
            </p>
          )}

          {mode === "deposit" ? (
            <>
              <CustomSelect
                label="Méthode de vérification"
                value={verificationMethod}
                onChange={(e) =>
                  setVerificationMethod(
                    e.target.value as "qr_scan" | "otp_code" | "manual_id_check"
                  )
                }
                options={verificationOptions}
              />
              <CustomInput
                label="Référence (QR / ID)"
                value={verificationReference}
                onChange={(e) => setVerificationReference(e.target.value)}
                placeholder="Scan ou saisie manuelle"
              />
            </>
          ) : (
            <CustomInput
              label="Code OTP destinataire"
              value={recipientOtp}
              onChange={(e) => setRecipientOtp(e.target.value)}
              required
              placeholder="Ex : 482910"
              hint="OTP test : 482910 (00001), 739201 (00002)"
            />
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "En cours..." : "Confirmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
