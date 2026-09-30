import type { Metadata } from 'next';
import './globals.css';
import './game-theme.css';
import './council.css';
import './metro.css';
import './traitor.css';
import './frontier.css';
import {AdBanner,AdSenseScript} from '@/components/AdSense';
const siteUrl = 'https://game-platform-rosy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Entre nous — Jeux multijoueurs entre amis',
    template: '%s | Entre nous'
  },
  description: 'Jouez gratuitement en ligne à quatre jeux multijoueurs de bluff, stratégie, rôles cachés et déduction, sans inscription.',
  applicationName: 'Entre nous',
  verification: {
    google: 'd0ZcgqOonTfnrTk85b-CK815wdhHz8KkmxjKYDBXJ7M'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Entre nous',
    url: siteUrl,
    title: 'Entre nous — Jeux multijoueurs entre amis',
    description: 'Quatre jeux gratuits de bluff, stratégie et rôles cachés à partager en ligne avec vos amis.'
  }
};
export default function RootLayout({ children }: { children: React.ReactNode }) { const client=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT??'';const topSlot=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_TOP_SLOT??'';const bottomSlot=process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_BOTTOM_SLOT??'';return <html lang="fr"><body><AdSenseScript client={client}/><AdBanner client={client} slot={topSlot} placement="top"/>{children}<AdBanner client={client} slot={bottomSlot} placement="bottom"/></body></html>; }
