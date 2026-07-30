import { Scale } from 'lucide-react';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata = {
  title: 'Mentions légales | TiiBnTick',
  description: 'Mentions légales et informations juridiques du service TiiBnTick.',
};

const sections = [
  {
    title: 'Éditeur du service',
    items: [
      'TiiBnTick est fourni par Yowyob Inc. Ltd, société à responsabilité limitée de droit camerounais, immatriculée au Registre du Commerce et du Crédit Mobilier sous le numéro RC/YAO/2020/B/1614, NIF M102015282478U.',
      'Le siège social est situé à Carrefour Anguissa, Yaoundé, S/C Yaoundé 1er, Rue 1.121 Djoungolo, Cameroun.',
    ],
  },
  {
    title: 'Objet du service',
    items: [
      'Le service propose une infrastructure logicielle, un environnement de confiance, un marché numérique, des outils d’exploitation et des interfaces de suivi destinés à la gestion de services logistiques, de collecte, d’acheminement, de relais et de livraison.',
      'Selon le module utilisé, les services peuvent être proposés par Yowyob, un partenaire, un point relais, un transporteur ou une agence spécialisée.',
    ],
  },
  {
    title: 'Coordonnées et contact',
    items: [
      'Pour toute question juridique, commerciale ou de conformité, les utilisateurs peuvent contacter la plateforme via les canaux de support et les adresses de contact indiquées dans les notices associées au service.',
      'Les coordonnées de contact de protection des données sont également disponibles dans la notice de confidentialité et dans les informations de conformité affichées dans les modules concernés.',
    ],
  },
  {
    title: 'Références juridiques et responsabilités',
    items: [
      'Le service est fourni dans le respect des lois applicables au Cameroun, notamment les textes relatifs au commerce électronique, à la cybersécurité, à la protection des données à caractère personnel et aux obligations contractuelles.',
      'Les conditions spécifiques d’un partenaire, d’un point relais, d’une agence ou d’une intégration API complètent les présentes mentions légales et peuvent modifier certaines obligations applicables.',
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <PolicyPage
      title="Mentions légales"
      badge="Informations juridiques"
      intro="Cette page récapitule les informations générales de l’éditeur, l’objet du service et les principales références juridiques associées à TiiBnTick."
      lastUpdated="25 juillet 2026"
      sections={sections}
      icon={Scale}
    />
  );
}
