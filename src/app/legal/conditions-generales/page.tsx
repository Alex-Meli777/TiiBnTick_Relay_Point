import { FileText } from 'lucide-react';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata = {
  title: 'Conditions générales d’utilisation | TiiBnTick',
  description: 'Conditions générales d’utilisation et de services de la plateforme TiiBnTick.',
};

const sections = [
  {
    title: 'Éditeur et objet',
    items: [
      'TiiBnTick est un écosystème numérique développé par Yowyob Inc. Ltd, une société de droit camerounais, destiné à faciliter la découverte, la mise en relation, l’organisation, l’exécution, la traçabilité et la gestion administrative de services logistiques et associés.',
      'Les présentes conditions générales d’utilisation et de services constituent le socle contractuel commun de la suite TiiBnTick. Elles complètent les conditions spécifiques applicables à une commande, à un partenaire, à un point relais, à une agence ou à une intégration API.',
    ],
  },
  {
    title: 'Accès et responsabilités des utilisateurs',
    items: [
      'Tout utilisateur peut accéder aux plateformes TiiBnTick avec ou sans compte, selon les modules mis à disposition. L’utilisateur s’engage à fournir des informations exactes, à respecter les règles de sécurité et à ne pas usurper l’identité d’autrui.',
      'Les comptes doivent être conservés de façon sécurisée. Les mots de passe, codes OTP, clés d’API et documents d’identité ne doivent jamais être partagés via des canaux non sécurisés.',
    ],
  },
  {
    title: 'Commandes, paiements et livraisons',
    items: [
      'Lorsqu’un service est commandé, l’utilisateur accepte les informations de collecte, d’acheminement, de point relais et de destination fournies dans le formulaire associé. Toute erreur de saisie peut entraîner un retard, un refus ou une interruption du service.',
      'Les paiements, frais de service et modalités de règlement sont communiqués au moment de la commande. Le transporteur, le point relais ou le partenaire peut appliquer des conditions particulières conformément aux offres et contrats applicables.',
    ],
  },
  {
    title: 'Données, preuves et incidents',
    items: [
      'Les données personnelles et opérationnelles traitées dans TiiBnTick sont protégées selon les notices de confidentialité et de cookies applicables. Les utilisateurs doivent utiliser les canaux officiels pour signaler des incidents, des litiges ou des demandes d’assistance.',
      'Yowyob met en place des procédures de sécurité, de suivi et de preuve pour faciliter la résolution de litiges, sans toutefois garantir une disponibilité absolue ou une absence de dysfonctionnement.',
    ],
  },
  {
    title: 'Limitation de responsabilité et droit applicable',
    items: [
      'TiiBnTick agit comme un facilitateur technique et opérationnel ; en conséquence, sa responsabilité est limitée aux cas prévus par la loi et les conditions particulières applicables au service concerné.',
      'Les présentes conditions sont régies par les règles applicables au Cameroun et par les textes sectoriels pertinents, notamment les règles relatives au commerce électronique, à la cybersécurité, à la protection des données et à la consommation.',
    ],
  },
];

export default function ConditionsGeneralesPage() {
  return (
    <PolicyPage
      title="Conditions générales d’utilisation"
      badge="CGU"
      intro="Les présentes conditions définissent les règles d’accès, d’usage et de responsabilité applicables à la suite TiiBnTick, depuis le portail public jusqu’aux modules partenaires et API."
      lastUpdated="25 juillet 2026"
      sections={sections}
      icon={FileText}
    />
  );
}
