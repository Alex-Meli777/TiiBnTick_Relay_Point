"use client";

import RelayPointApplicationForm from "@/components/relay/RelayPointApplicationForm";

export default function ApplyRelayPointForm() {
  return (
    <RelayPointApplicationForm
      submitUrl="/api/relay-points/apply"
      submitLabel="Soumettre ma candidature"
      successTitle="Candidature envoyée"
      successDescription="Notre équipe a bien reçu votre demande et vous contactera sous peu."
    />
  );
}
