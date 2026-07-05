"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package } from "lucide-react";
import { CustomInput } from "@/components/ui/CustomInput";
import { relayOwnerLogin } from "@/services/handoverService";
import { useToast } from "@/components/ui/Toast";

export default function RelayAuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [phone, setPhone] = useState("+237699999999");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await relayOwnerLogin(phone, password);
      toast("Connexion réussie", "success");
      const redirect = searchParams.get("redirect") ?? "/relay-dashboard";
      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Identifiants incorrects",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Package className="mx-auto mb-2 h-10 w-10 text-orange-600" />
          <h1 className="text-xl font-bold">Espace propriétaire</h1>
          <p className="text-sm text-gray-500">Point relais TiiBnTick</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            label="Téléphone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <CustomInput
            label="Mot de passe"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Démo : +237699999999 / 123456
        </p>
      </div>
    </div>
  );
}
