'use client';
import Script from 'next/script';
import {useEffect,useRef} from 'react';

declare global{interface Window{adsbygoogle?:Record<string,unknown>[]}}

export function AdSenseScript({client}:{client:string}){
  if(!client)return null;
  return <Script id="google-adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}/>;
}

export function AdBanner({client,slot,placement}:{client:string;slot:string;placement:'top'|'bottom'}){
  const initialized=useRef(false),enabled=Boolean(client&&slot);
  useEffect(()=>{if(!enabled||initialized.current)return;initialized.current=true;try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch{}},[enabled]);
  return <aside className={`ad-banner ad-banner-${placement}`} aria-label="Publicité">
    <span className="ad-label">PUBLICITÉ</span>
    {enabled?<ins className="adsbygoogle" style={{display:'block'}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/>:<div className="ad-placeholder"><b>ESPACE PUBLICITAIRE</b><small>970 × 90 · GOOGLE ADSENSE</small></div>}
  </aside>;
}
