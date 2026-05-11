import CacheLink from '@/components/commons/CacheLink';
import { AlertCircle, FileText, Shield, UserCheck } from 'lucide-react';
import React from 'react';

export interface TermsSection {
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  content: React.ReactNode;
}

const List = React.memo(({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 ml-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-2">
        <span className="mt-1 flex-shrink-0 text-[var(--accent-violet)] dark:text-[var(--accent-gold)]">•</span>
        <span className="text-[var(--text-light)] dark:text-[var(--text-dark)]">{item}</span>
      </li>
    ))}
  </ul>
));

export function useTermsSections(): TermsSection[] {
  
  return [
    {
      number: '1',
      title: 'Acceptation des conditions',
      icon: UserCheck,
      iconColor: 'bg-[var(--accent-gold)]/10 dark:bg-[var(--accent-violet)]/20 text-[var(--accent-violet)] dark:text-[var(--accent-gold)]',
      content: (
        <p>
          L'utilisation de Mon Étoile implique l'acceptation pleine et entière de ces
          conditions. Nous pouvons les modifier à tout moment ; consultez-les régulièrement.
        </p>
      ),
    },
    {
      number: '2',
      title: 'Description du service',
      icon: Shield,
      iconColor: 'bg-[var(--accent-violet)]/10 dark:bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] dark:text-[var(--accent-violet)]',
      content: (
        <>
          <p>Mon Étoile propose des services de guidance, astrologie, numérologie et guidance spirituelle :</p>
          <List items={[
            'Consultations avec des professionnels qualifiés',
            'Analyses astrologiques et numérologiques',
            "Lectures de tarot et d'oracles",
            'Pratiques spirituelles et développement personnel',
            'Boutique de livres et ressources spirituelles',
          ]} />
        </>
      ),
    },
    {
      number: '3',
      title: 'Compte utilisateur',
      icon: UserCheck,
      iconColor: 'bg-[var(--accent-violet)]/10 dark:bg-[var(--accent-gold)]/20 text-[var(--accent-violet)] dark:text-[var(--accent-gold)]',
      content: (
        <>
          <p>Pour accéder à certains services, créez un compte. Vous vous engagez à :</p>
          <List items={[
            'Fournir des informations exactes et à jour',
            'Maintenir la confidentialité de vos identifiants',
            'Être responsable des activités sur votre compte',
            'Nous informer de toute utilisation non autorisée',
          ]} />
        </>
      ),
    },
    {
      number: '4',
      title: 'Utilisation acceptable',
      icon: Shield,
      iconColor: 'bg-[var(--pastel-emerald)]/10 dark:bg-[var(--pastel-emerald)]/20 text-[var(--pastel-emerald)] dark:text-[var(--accent-gold)]',
      content: (
        <>
          <p>Vous acceptez de ne pas :</p>
          <List items={[
            'Utiliser le service à des fins illégales',
            'Accéder à des comptes non autorisés',
            'Transmettre des virus ou codes malveillants',
            "Harceler ou nuire à d'autres utilisateurs",
            "Collecter des données sur d'autres utilisateurs",
            'Reproduire le contenu sans autorisation',
          ]} />
        </>
      ),
    },
    {
      number: '5',
      title: 'Paiements et remboursements',
      icon: Shield,
      iconColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      content: (
        <>
          <p>
            Les tarifs sont indiqués en devise locale. Paiements sécurisés. Remboursements possibles :
          </p>

          <List items={[
            'Annulation avant prestation : remboursement intégral',
            'Service non rendu : remboursement intégral',
            'Insatisfaction : évaluation au cas par cas',
          ]} />
        </>
      ),
    },
    {
      number: '6',
      title: 'Propriété intellectuelle',
      icon: FileText,
      iconColor: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      content: (
        <p>
          Tous les contenus (textes, images, logos, vidéos) sont protégés par les droits
          de propriété intellectuelle. Reproduction interdite sans autorisation écrite.
        </p>
      ),
    },
    {
      number: '7',
      title: 'Limitation de responsabilité',
      icon: AlertCircle,
      iconColor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      content: (
        <>
          <p>Mon Étoile fournit des services de guidance et divertissement. Nous ne garantissons pas :</p>
          <List items={[
            "L'exactitude absolue des prédictions",
            'Des résultats spécifiques',
            'La disponibilité continue du service',
          ]} />
          <p className="mt-3 font-semibold text-red-700 dark:text-red-400">
            ⚠️ Nos services ne remplacent pas un avis médical, juridique ou financier professionnel.
          </p>
        </>
      ),
    },
    {
      number: '8',
      title: 'Protection des données',
      icon: Shield,
      iconColor: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      content: (
        <p>
          Nous protégeons vos données conformément aux réglementations. Consultez notre{' '}
          <CacheLink href="/privacy" className="text-[#2E5AA6] dark:text-[#9BC2FF] hover:underline font-semibold">
            politique de confidentialité
          </CacheLink>.
        </p>
      ),
    },
    {
      number: '9',
      title: 'Modification des conditions',
      icon: FileText,
      iconColor: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      content: (
        <p>
          Nous pouvons modifier ces conditions à tout moment. Les modifications sont
          effectives dès publication. Votre utilisation continue constitue votre acceptation.
        </p>
      ),
    },
    {
      number: '10',
      title: 'Résiliation',
      icon: AlertCircle,
      iconColor: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      content: (
        <p>
          Nous pouvons suspendre ou résilier votre compte en cas de violation,
          sans préavis et sans remboursement.
        </p>
      ),
    },
    {
      number: '11',
      title: 'Loi applicable',
      icon: Shield,
      iconColor: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      content: (
        <p>Ces conditions sont régies par le droit ivoirien. Les litiges seront soumis aux tribunaux compétents.
        </p>
      ),
    },
  ];
}
