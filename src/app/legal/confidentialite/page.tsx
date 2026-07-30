import { ShieldCheck } from 'lucide-react';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata = {
  title: 'Politique de confidentialité | TiiBnTick',
  description: 'Politique de confidentialité et protection des données personnelles de TiiBnTick.',
};

const sections = [
  {
    title: 'Responsable du traitement',
    items: [
      'Yowyob Inc. Ltd agit comme responsable du traitement pour les opérations de création de comptes, d’exploitation de la plateforme commune, de support, de prévention de la fraude, d’amélioration et de gouvernance de la suite TiiBnTick.',
      'Les contacts de confidentialité, de sécurité et de conformité sont indiqués dans les notices applicables et peuvent être communiqués à l’utilisateur au besoin.',
    ],
  },
  {
    title: 'Données collectées',
    items: [
      'TiiBnTick peut collecter des données d’identification, des coordonnées, des informations de commande, des données de livraison, des informations de paiement, des preuves d’opération et des données techniques liées à l’utilisation du service.',
      'Certaines données peuvent être reçues directement depuis un expéditeur, un destinataire, un partenaire, un point relais, un transporteur ou une application tierce intégrée au réseau.',
    ],
  },
  {
    title: 'Finalités et conservation',
    items: [
      'Les données sont utilisées pour fournir le service, permettre la traçabilité, sécuriser l’écosystème, assurer le support et prévenir les abus ou fraudes.',
      'La conservation des données suit les règles de la politique de confidentialité, les obligations légales applicables et les besoins opérationnels de la plateforme.',
    ],
  },
  {
    title: 'Vos droits et contacts',
    items: [
      'Les utilisateurs peuvent demander l’accès, la rectification, la limitation, l’opposition ou l’effacement de leurs données, dans les limites prévues par la loi et les contraintes techniques du service.',
      'Toute demande peut être adressée au contact vie privée de l’éditeur ainsi qu’aux canaux de support et de conformité mis à disposition dans les interfaces concernées.',
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <PolicyPage
      title="Politique de confidentialité"
      badge="Vie privée"
      intro="Cette notice explique comment TiiBnTick collecte, utilise, partage et protège les données personnelles dans le cadre de ses services."
      lastUpdated="25 juillet 2026"
      sections={sections}
      icon={ShieldCheck}
    />
  );
}
