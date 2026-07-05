import { Suspense } from "react";
import RelayAuthLoginForm from "./RelayAuthLoginForm";

export default function RelayAuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center text-gray-400">
          Chargement...
        </div>
      }
    >
      <RelayAuthLoginForm />
    </Suspense>
  );
}
