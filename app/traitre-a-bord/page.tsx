import type { Metadata } from 'next';
import TraitorAboard from '@/components/TraitorAboard';

export const metadata: Metadata = {
  title: 'Traîtres à bord — Jeu de bluff et de mutinerie',
  description: 'Jouez à Traîtres à bord avec 3 à 8 amis : remplissez le coffre, bluffez sur votre butin et démasquez les Mutins avant la fin de la pioche.',
  alternates: { canonical: '/traitre-a-bord' }
};

export default function TraitorPage(){return <TraitorAboard/>}
