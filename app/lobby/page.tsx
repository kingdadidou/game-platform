import type { Metadata } from 'next';
import Lobby from '@/components/Lobby';

export const metadata: Metadata = {
  title: 'Conseil des Ombres — Jeu de bluff en ligne',
  description: 'Jouez gratuitement à Conseil des Ombres, un jeu de rôles cachés pour 5 à 10 joueurs. Formez des équipes, votez et démasquez les saboteurs.',
  alternates: { canonical: '/lobby' }
};

export default function Page() { return <Lobby/>; }
