import type { Metadata } from 'next';
import './globals.css';
import './game-theme.css';
import './council.css';
import './metro.css';
export const metadata: Metadata = { title: 'Entre nous — Jeux entre amis', description: 'Créez un salon et retrouvez vos amis autour du Conseil des Ombres, un jeu original de bluff et de rôles cachés.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="fr"><body>{children}</body></html>; }
