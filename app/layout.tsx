import type { Metadata } from 'next';
import './globals.css';
import './game-theme.css';
import './council.css';
import './metro.css';
import './traitor.css';
export const metadata: Metadata = { title: 'Entre nous — Jeux entre amis', description: 'Quatre jeux multijoueurs originaux de bluff, stratégie, rôles cachés et déduction à partager entre amis.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="fr"><body>{children}</body></html>; }
