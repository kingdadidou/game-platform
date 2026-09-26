import type { Metadata } from 'next';
import './globals.css';
import './game-theme.css';
import './council.css';
import './metro.css';
import './traitor.css';
import {AdBanner,AdSenseScript} from '@/components/AdSense';
export const metadata: Metadata = { title: 'Entre nous — Jeux entre amis', description: 'Quatre jeux multijoueurs originaux de bluff, stratégie, rôles cachés et déduction à partager entre amis.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { const client=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT??'';const topSlot=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TOP_SLOT??'';const bottomSlot=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_BOTTOM_SLOT??'';return <html lang="fr"><body><AdSenseScript client={client}/><AdBanner client={client} slot={topSlot} placement="top"/>{children}<AdBanner client={client} slot={bottomSlot} placement="bottom"/></body></html>; }
