# TiiBnTick — Module Point Relais (MVP Frontend)

Service de points relais pour la plateforme **TiiBnTick** / **TicBnPick**.  
MVP Next.js 14 (App Router, TypeScript, Tailwind) avec API mockées (`app/api/`) et store en mémoire.

## Fonctionnalités implémentées (branche `GNIDJEO`)

| # | Fonctionnalité | Route |
|---|----------------|-------|
| 1 | Parcourir les points relais (carte + liste, recherche par proximité) | `/relay-points` |
| 2 | Voir les détails d'un point relais | `/relay-points/[id]` |
| 3 | Postuler pour la création d'un point relais | `/relay-points/postuler` |
| 4 | Activer le suivi de livraison (livreur partage sa position) | `/tracking/activate` |
| 5 | Suivre une livraison (client — carte live via lien) | `/tracking/[shareToken]` |
| 6 | Soumettre une preuve de livraison | `/tracking/proof` |
| 7 | Voir les informations de SON point relais (dashboard gestionnaire) | `/relay-dashboard` |

## Stack

- Next.js 14 · TypeScript · Tailwind CSS · react-leaflet
- JWT httpOnly (`relay_auth_token`) + `middleware.ts` pour `/relay-dashboard`
- Contrat DTO : `src/types/relayPoint.ts`
- Services : `relayPointService.ts`, `handoverService.ts` (pattern `apiFetch`)

## Installation

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
```

## Compte démo propriétaire

| Champ | Valeur |
|-------|--------|
| Téléphone | `+237699999999` |
| Mot de passe | `123456` |

## Données de test

- Points relais : Douala & Yaoundé (Cameroun)
- OTP retrait : `482910` (colis `TBT-CM-2026-00001`), `739201` (`TBT-CM-2026-00002`)

## Structure

```
src/
  app/relay-points/       # Public — parcourir & détails
  app/relay-dashboard/    # Protégé — gestionnaire
  app/tracking/           # Suivi & preuve de livraison
  app/api/                # Route handlers mock (contrat backend)
  components/relay/       # UI métier
  types/relayPoint.ts     # DTOs
  mocks/relayPointsSeed.ts
```

## Contrat backend

Les fichiers `src/types/relayPoint.ts` et `src/app/api/**` définissent le contrat HTTP/JSON attendu du backend réel.
