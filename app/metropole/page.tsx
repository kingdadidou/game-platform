import type { Metadata } from 'next';
import Metropole from '@/components/Metropole';

export const metadata: Metadata = {
  title: 'Métropole — Jeu immobilier multijoueur en ligne',
  description: 'Construisez votre fortune à Métropole : choisissez vos itinéraires, achetez des quartiers, bâtissez des maisons et négociez entre 2 et 6 joueurs.',
  alternates: { canonical: '/metropole' }
};

export default function Page(){return <Metropole/>}
