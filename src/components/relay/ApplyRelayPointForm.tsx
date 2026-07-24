"use client";

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RelayPointApplicationForm from "@/components/relay/RelayPointApplicationForm";
import type { RelayPointApplication } from "@/types/relayPoint";

export default function ApplyRelayPointForm() {
  const searchParams = useSearchParams();
  const [defaultManager, setDefaultManager] = useState<RelayPointApplication["manager"] | null>(null);
  const [skipManagerStep, setSkipManagerStep] = useState(false);

  useEffect(() => {
    const shouldSkip = searchParams.get("skipManager") === "1";
    if (!shouldSkip) {
      return;
    }

    setSkipManagerStep(true);
    (async () => {
      try {
        const res = await fetch("/api/relay-auth/me");
        const data = await res.json();
        if (!res.ok || !data?.success) {
          setSkipManagerStep(false);
          return;
        }

        const [firstName, ...rest] = data.data.fullName.split(" ");
        setDefaultManager({
          firstName: firstName ?? "",
          lastName: rest.join(" ") || "",
          phone: data.data.phone ?? "",
          email: data.data.email ?? "",
          password: "",
        });
      } catch {
        setSkipManagerStep(false);
      }
    })();
  }, [searchParams]);

  return (
    <RelayPointApplicationForm
      submitUrl="/api/relay-points/apply"
      submitLabel="Soumettre ma candidature"
      successTitle="Candidature envoyée"
      successDescription="Notre équipe a bien reçu votre demande et vous contactera sous peu."
      skipManagerStep={skipManagerStep && Boolean(defaultManager)}
      defaultManager={defaultManager ?? undefined}
    />
  );
}
