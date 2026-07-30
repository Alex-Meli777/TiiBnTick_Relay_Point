import { Cookie } from 'lucide-react';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata = {
  title: 'Politique des cookies | TiiBnTick',
  description: 'Politique relative aux cookies, traceurs et technologies similaires utilisées par TiiBnTick.',
};

const sections = [
  {
    title: 'Objectif et portée',
    items: [
      'Cette politique décrit les cookies, traceurs, balises, SDK, stockages locaux et technologies similaires susceptibles d’être utilisés par TiiBnTick sur ses sites web, applications web, PWA, applications mobiles et interfaces associées.',
      'Le choix de consentement affiché dans le gestionnaire de consentement ou dans les paramètres du service prévaut pour les fournisseurs, durées et finalités réellement actifs sur un domaine ou appareil donné.',
    ],
  },
  {
    title: 'Catégories de technologies',
    items: [
      'Les cookies essentiels servent à l’authentification, à la sécurité, à la gestion de session et à la continuité du service. Ils peuvent être activés sans consentement lorsqu’ils sont strictement nécessaires au fonctionnement du service.',
      'Les cookies fonctionnels, d’analyse, de performance, de sécurité et publicitaires ne sont activés qu’après consentement de l’utilisateur, selon les choix effectués dans le panneau de configuration.',
    ],
  },
  {
    title: 'Gestion du consentement',
    items: [
      'TiiBnTick propose un mécanisme de gestion du consentement accessible depuis le pied de page, les paramètres du service ou l’application. Les préférences sont conservées pendant une durée définie et peuvent être modifiées à tout moment.',
      'La désactivation de catégories non essentielles peut affecter certaines fonctionnalités comme la sauvegarde des préférences, le suivi de colis, l’historique ou certaines mesures d’audience.',
    ],
  },
  {
    title: 'Protection des utilisateurs et contacts',
    items: [
      'Les fournisseurs tiers peuvent déposer leurs propres cookies ou SDK pour fournir des services de cartographie, de paiement, d’analytics ou de publicité. Leur usage est soumis à leurs propres règles de confidentialité et de cookies.',
      'Les utilisateurs peuvent gérer les cookies dans leur navigateur et contrôler les identifiants publicitaires sur les systèmes mobiles. Les contacts de confidentialité et de conformité restent disponibles pour toute question supplémentaire.',
    ],
  },
];

export default function PolitiqueCookiesPage() {
  return (
    <PolicyPage
      title="Politique des cookies"
      badge="Cookies & traceurs"
      intro="Cette notice explique comment TiiBnTick utilise les cookies, traceurs et technologies similaires pour offrir, sécuriser et améliorer ses services."
      lastUpdated="25 juillet 2026"
      sections={sections}
      icon={Cookie}
    />
  );
}
