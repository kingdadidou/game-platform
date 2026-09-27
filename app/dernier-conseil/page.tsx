import type { Metadata } from 'next';
import LastCouncil from '@/components/LastCouncil';

export const metadata: Metadata = {
  title: 'Le Dernier Conseil — Jeu politique à rôles cachés',
  description: 'Réunissez 5 à 10 joueurs, élisez un gouvernement, votez les décrets et démasquez le Prétendant dans ce jeu politique en ligne.',
  alternates: { canonical: '/dernier-conseil' }
};

export default function Page() { return <LastCouncil/>; }
