import CacheLink from '@/components/commons/CacheLink';
import { AlertCircle, FileText, Gamepad2, Shield } from 'lucide-react';
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
        <span className="mt-1 flex-shrink-0 text-purple-500">•</span>
        <span className="text-purple-700">{item}</span>
      </li>
    ))}
  </ul>
));

export function useTermsSections(): TermsSection[] {

  return [
    {
      number: '1',
      title: 'Acceptation des conditions',
      icon: Shield,
      iconColor: 'bg-purple-100 text-purple-600',
      content: (
        <p>
          En jouant à <span className="font-bold text-purple-600">Quatre Cases</span>, vous acceptez pleinement ces conditions d'utilisation.
          Nous pouvons les modifier à tout moment pour améliorer votre expérience de jeu.
        </p>
      ),
    },
    {
      number: '2',
      title: 'Description du jeu',
      icon: Gamepad2,
      iconColor: 'bg-indigo-100 text-indigo-600',
      content: (
        <>
          <p>Quatre Cases est un jeu de logique où vous devez : </p>
          <List items={[
            'Remplir 4 cases avec des chiffres de 0 à 9',
            'Ne jamais répéter le même chiffre',
            'Utiliser votre logique pour trouver la bonne combinaison',
            'Jouer en mode clic ou glisser-déposer',
          ]} />
        </>
      ),
    },
    {
      number: '3',
      title: 'Compte utilisateur',
      icon: Shield,
      iconColor: 'bg-purple-100 text-purple-600',
      content: (
        <>
          <p>Pour accéder à certaines fonctionnalités, vous pouvez créer un compte :</p>
          <List items={[
            'Sauvegarder vos scores et statistiques',
            'Suivre votre progression',
            'Participer au classement des joueurs',
            'Recevoir des défis quotidiens',
          ]} />
        </>
      ),
    },
    {
      number: '4',
      title: 'Utilisation acceptable',
      icon: Shield,
      iconColor: 'bg-emerald-100 text-emerald-600',
      content: (
        <>
          <p>En jouant à Quatre Cases, vous acceptez de ne pas :</p>
          <List items={[
            'Tricher ou utiliser des programmes automatisés',
            'Tenter de pirater ou modifier le jeu',
            'Perturber l\'expérience des autres joueurs',
            "Utiliser le jeu à des fins malveillantes",
          ]} />
        </>
      ),
    },
    {
      number: '5',
      title: 'Propriété intellectuelle',
      icon: FileText,
      iconColor: 'bg-indigo-100 text-indigo-600',
      content: (
        <p>
          Le jeu Quatre Cases, son code, son design et son concept sont la propriété exclusive de Diambra.
          Toute reproduction ou copie sans autorisation est interdite.
        </p>
      ),
    },
    {
      number: '6',
      title: 'Limitation de responsabilité',
      icon: AlertCircle,
      iconColor: 'bg-rose-100 text-rose-600',
      content: (
        <>
          <p>Quatre Cases est un jeu de divertissement. Nous ne garantissons pas :</p>
          <List items={[
            'La disponibilité permanente du jeu',
            "L'absence totale de bugs ou d'erreurs",
            'Des performances spécifiques',
          ]} />
        </>
      ),
    },
    {
      number: '7',
      title: 'Protection des données',
      icon: Shield,
      iconColor: 'bg-teal-100 text-teal-600',
      content: (
        <p>
          Nous protégeons vos données conformément aux réglementations. Consultez notre{' '}
          <CacheLink href="/privacy" className="text-purple-600 hover:underline font-semibold">
            politique de confidentialité
          </CacheLink>.
        </p>
      ),
    },
    {
      number: '8',
      title: 'Résiliation',
      icon: AlertCircle,
      iconColor: 'bg-rose-100 text-rose-600',
      content: (
        <p>
          Nous nous réservons le droit de suspendre ou résilier un compte en cas de violation
          flagrante de ces conditions.
        </p>
      ),
    },
    {
      number: '9',
      title: 'Loi applicable',
      icon: Shield,
      iconColor: 'bg-cyan-100 text-cyan-600',
      content: (
        <p>Ces conditions sont régies par le droit ivoirien. En cas de litige, les tribunaux compétents seront saisis.</p>
      ),
    },
  ];
}