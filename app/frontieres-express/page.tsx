import type { Metadata } from 'next';
import FrontierExpress from '@/components/FrontierExpress';

export const metadata: Metadata = {
  title: 'Frontières Express — Jeu de stratégie multijoueur rapide',
  description: 'Conquérez un continent en huit manches dans ce jeu de stratégie en ligne pour 2 à 6 joueurs. Programmez vos ordres, recrutez et négociez.',
  alternates: { canonical: '/frontieres-express' }
};

export default function FrontierPage(){return <FrontierExpress/>}
