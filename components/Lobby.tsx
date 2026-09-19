'use client';
import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';

type Player = { id: string; name: string; ready: boolean };
type Game = { phase: string; role: string; spies: string[]; leader: string; team: string[]; teamSize: number; results: { success: boolean; failures: number; team: string[] }[]; rejected: number; history: { team: string[]; votes: Record<string, boolean>; approved: boolean }[]; voted: string[]; acted: string[]; winner?: string };
type Room = { code: string; host: string; me: string; players: Player[]; messages: { id: string; name: string; text: string }[]; game: Game | null };
type Session = { code: string; token: string };
export default function Lobby() {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState(''); const [code, setCode] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(''); const [team, setTeam] = useState<string[]>([]);
  const [reveal, setReveal] = useState(false); const [notice, setNotice] = useState('');
  const requestLock = useRef(false);
  const revision = useRef(0);
  useEffect(() => {
    const invite = new URLSearchParams(window.location.search).get('code');
    if (invite) setCode(invite.toUpperCase());
    try { const saved = JSON.parse(sessionStorage.getItem('entre-nous') || 'null'); if (saved?.code && saved?.token && (!invite || invite.toUpperCase() === saved.code)) setSession(saved); } catch { /* No usable session. */ }
  }, []);
  useEffect(() => {
    if (!session) return;
    let active = true; let polling = false;
    const refresh = async () => {
      if (requestLock.current || polling) return;
      polling = true;
      const startedAtRevision = revision.current;
      try {
        const response = await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ action: 'state', code: session.code }) });
        const data = await response.json();
        if (!active || startedAtRevision !== revision.current || requestLock.current) return;
        if (!response.ok) { setError(data.error); if (response.status === 400) { setSession(null); setRoom(null); sessionStorage.removeItem('entre-nous'); } return; }
        setRoom(data.room); setError('');
      } catch { if (active && startedAtRevision === revision.current && !requestLock.current) setError('Connexion interrompue. Nouvelle tentative automatique…'); }
      finally { polling = false; }
    };
    void refresh(); const timer = setInterval(refresh, 1500);
    return () => { active = false; clearInterval(timer); };
  }, [session]);
  async function action(action: string, fields: Record<string, unknown> = {}) {
    if (busy || requestLock.current) return;
    requestLock.current = true; revision.current++; setBusy(true); setError('');
    try {
      const response = await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(session ? { Authorization: `Bearer ${session.token}` } : {}) }, body: JSON.stringify({ action, code: session?.code ?? code, name, round: room?.game?.results.length, rejected: room?.game?.rejected, ...fields }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.token) { const next = { code: data.room.code, token: data.token }; sessionStorage.setItem('entre-nous', JSON.stringify(next)); setSession(next); }
      setRoom(data.room);
      if (action === 'chat') setMessage('');
      if (['start','reset','nominate','leave'].includes(action)) { setTeam([]); setReveal(false); }
      if (action === 'leave') { setSession(null); sessionStorage.removeItem('entre-nous'); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Impossible de contacter le serveur.'); }
    finally { requestLock.current = false; setBusy(false); }
  }
  const g = room?.game;
  const names = (ids: string[]) => ids.map(id => room?.players.find(p => p.id === id)?.name ?? '?').join(', ');
  async function copyInvite() {
    const url = `${window.location.origin}/lobby?code=${room?.code}`;
    try { await navigator.clipboard.writeText(url); setNotice('Lien copié !'); } catch { setNotice(`Lien à partager : ${url}`); }
  }
  function submitChat(e: FormEvent) { e.preventDefault(); void action('chat', { text: message }); }
  return <main className={`shell play-shell ${room?.game ? 'game-is-live' : ''}`}><header className="nav play-nav"><Link className="brand" href="/"><span className="brand-seal">E/N</span> entre nous.</Link><span className="game-wordmark">Conseil <i>des</i> Ombres</span></header>
    <div role="alert" className={error ? 'alert' : ''}>{error}</div>
    {!room ? <section className="entry"><p className="eyebrow">UNE PLACE VOUS ATTEND</p><h1>À vous de jouer<span className="brand-dot">.</span></h1><p className="intro">Réunissez 5 à 10 amis. Les secrets restent entre vous.</p><div className="panel"><label htmlFor="name">Votre pseudo</label><input id="name" maxLength={20} minLength={2} value={name} onChange={e => setName(e.target.value)} placeholder="Comment vous appelle-t-on ?" autoComplete="nickname"/><div className="entry-grid"><div><h2>Une nouvelle soirée</h2><p>Créez un salon privé et invitez votre bande.</p><button disabled={busy || !!session || name.trim().length < 2} onClick={() => action('create')}>Créer un salon →</button></div><form onSubmit={e => { e.preventDefault(); void action('join'); }}><h2>La bande est déjà là ?</h2><label htmlFor="code">Code du salon</label><input id="code" value={code} maxLength={8} pattern="[A-Fa-f0-9]{8}" required onChange={e => setCode(e.target.value.toUpperCase().replace(/\s/g,''))} placeholder="Ex. A7F3B82C"/><button className="secondary" disabled={busy || !!session || name.trim().length < 2 || code.length !== 8}>Rejoindre →</button></form></div>{session && <p role="status">Reconnexion au salon…</p>}</div></section> : <>
      <div className="room-heading"><div><p className="eyebrow">DOSSIER CONFIDENTIEL · SALON PRIVÉ</p><h1>{g ? 'Conseil des Ombres' : 'Tout le monde est là ?'}</h1></div><div className="invite-docket"><small>CODE D’ACCÈS</small><span className="code">{room.code}</span><button className="secondary small" onClick={copyInvite}>Inviter ↗</button></div></div><p role="status" className="notice">{notice}</p>
      <div className="room-grid"><aside className="panel"><p className="eyebrow">AUTOUR DE LA TABLE · {room.players.length}/10</p><ul className="players">{room.players.map((p,i) => <li key={p.id}><span className={`avatar color-${i%3}`}>{p.name.slice(0,1).toUpperCase()}</span><div><b>{p.name}{p.id === room.me ? ' (vous)' : ''}</b><small>{p.id === room.host ? 'Hôte' : 'Joueur'}{g?.leader === p.id ? ' · Capitaine' : ''}</small></div><span className="ready">{!g && p.ready ? '✓' : ''}</span></li>)}</ul>{(!g || g.phase === 'finished') && <button className="secondary small" disabled={busy} onClick={() => action('leave')}>Quitter le salon</button>}<p className="muted fine">Vous pouvez actualiser cette page pour retrouver votre session. En partie, gardez votre onglet ouvert : tous les joueurs doivent participer.</p></aside>
      <section className="panel game-panel"><div className="classified-strip" aria-hidden="true"><span>ARCHIVES DU CONSEIL</span><b>◆</b><span>ACCÈS RESTREINT</span></div>{!g ? <><span className="tag">AVANT LE PREMIER BLUFF</span><h2>La confiance, ça se mérite.</h2><p>Deux camps, un seul conseil. Les Agents veulent réussir trois missions. Les Ombres veulent en saboter trois, sans se faire démasquer.</p><div className="waiting-symbol" aria-hidden="true"><span>◆</span><b>?</b><span>◆</span></div><p>{room.players.length < 5 ? `Encore ${5-room.players.length} joueur(s) pour commencer.` : 'Quand tout le monde est prêt, l’hôte peut lancer la partie.'}</p><div className="actions"><button disabled={busy} onClick={() => action('ready')}>{room.players.find(p => p.id === room.me)?.ready ? 'Je ne suis plus prêt' : 'Je suis prêt ✓'}</button>{room.host === room.me && <button className="secondary" disabled={busy || room.players.length < 5 || !room.players.every(p => p.ready)} onClick={() => action('start')}>Lancer la partie →</button>}</div></> : <>
        <div className="score">{[0,1,2,3,4].map(i => <span key={i} className={g.results[i] ? g.results[i].success ? 'success' : 'failed' : ''} title={g.results[i] ? `${g.results[i].failures} sabotage(s)` : 'À venir'}>{g.results[i] ? g.results[i].success ? '✓' : '×' : i+1}</span>)}</div>
        <div className="role-box"><button className="secondary small" onClick={() => setReveal(!reveal)}>{reveal ? 'Masquer mon rôle' : 'Voir mon rôle secret'}</button>{reveal && <p>Vous êtes <strong>{g.role === 'ombre' ? 'une Ombre' : 'un Agent'}</strong>. {g.role === 'ombre' ? `Les Ombres : ${names(g.spies)}.` : 'Faites réussir les missions et trouvez à qui faire confiance.'}</p>}</div>
        {g.phase === 'finished' ? <><p className="eyebrow">LE CONSEIL A RENDU SON VERDICT</p><h2>{g.winner === 'agents' ? 'Les Agents l’emportent !' : 'Les Ombres l’emportent !'}</h2><p>Les Ombres étaient : {names(g.spies)}.</p>{g.rejected >= 5 && <p>Cinq équipes ont été refusées de suite.</p>}{room.host === room.me && <button disabled={busy} onClick={() => action('reset')}>Préparer une revanche ↗</button>}</> : <><p className="eyebrow">MISSION {g.results.length+1} · {g.rejected}/5 ÉQUIPES REFUSÉES</p><h2>{g.phase === 'nomination' ? 'Qui part en mission ?' : g.phase === 'vote' ? 'Vous leur faites confiance ?' : 'À vous de décider, en secret.'}</h2>
        {g.phase === 'nomination' && <><p>{names([g.leader])} doit proposer une équipe de {g.teamSize} joueurs.</p>{g.leader === room.me && <><div className="team-options">{room.players.map(p => <label key={p.id}><input type="checkbox" checked={team.includes(p.id)} onChange={e => setTeam(e.target.checked ? [...team,p.id] : team.filter(id => id !== p.id))}/>{p.name}</label>)}</div><button disabled={busy || team.length !== g.teamSize} onClick={() => action('nominate', { team })}>Proposer cette équipe ({team.length}/{g.teamSize})</button></>}</>}
        {g.phase === 'vote' && <><p>Équipe proposée : <strong>{names(g.team)}</strong>.</p><p>{g.voted.length}/{room.players.length} votes reçus. Une majorité stricte est nécessaire.</p>{g.voted.includes(room.me) ? <p className="notice">Votre vote est enregistré.</p> : <div className="actions"><button disabled={busy} onClick={() => action('vote', { approve: true })}>Approuver</button><button className="secondary" disabled={busy} onClick={() => action('vote', { approve: false })}>Refuser</button></div>}</>}
        {g.phase === 'mission' && <><p>En mission : <strong>{names(g.team)}</strong>.</p><p>{g.acted.length}/{g.team.length} décisions reçues. Un seul sabotage fait échouer la mission.</p>{!g.team.includes(room.me) ? <p>Votre équipe agit. Patience…</p> : g.acted.includes(room.me) ? <p className="notice">Votre décision reste secrète.</p> : <div className="actions"><button disabled={busy} onClick={() => action('mission', { success: true })}>Faire réussir</button>{g.role === 'ombre' && <button className="danger" disabled={busy} onClick={() => action('mission', { success: false })}>Saboter</button>}</div>}</>}
        </>}
        {g.history.length > 0 && <details><summary>Historique des votes ({g.history.length})</summary>{g.history.map((h,i) => <p key={i}><strong>Équipe {i+1} : {h.approved ? 'acceptée' : 'refusée'}</strong><br/>{names(h.team)}<br/><small>{Object.entries(h.votes).map(([id,yes]) => `${names([id])} : ${yes ? 'oui' : 'non'}`).join(' · ')}</small></p>)}</details>}
      </>}</section>
      <aside className="panel chat"><p className="eyebrow">LES DISCUSSIONS</p><div className="messages" aria-live="polite">{room.messages.length === 0 && <p className="muted">Le calme avant les accusations…<br/>Dites bonsoir à la bande.</p>}{room.messages.map(m => <p key={m.id}><b>{m.name}</b><span>{m.text}</span></p>)}</div><form onSubmit={submitChat}><label className="sr-only" htmlFor="message">Votre message</label><input id="message" maxLength={400} value={message} onChange={e => setMessage(e.target.value)} placeholder="À vous de parler…"/><button className="small" disabled={busy || !message.trim()}>Envoyer ↑</button></form></aside></div>
    </>}
    <details className="rules"><summary>Comment jouer au Conseil des Ombres ?</summary><div><p>Pour 5–6 joueurs : 2 Ombres. Pour 7–9 joueurs : 3 Ombres. À 10 joueurs : 4 Ombres. Les autres sont des Agents. Les Ombres se connaissent ; les Agents ne connaissent que leur propre rôle.</p><ol><li>Le capitaine propose une équipe. Il peut en faire partie.</li><li>Tout le monde vote. L’équipe part seulement si plus de la moitié approuve. En cas de refus, le capitaine change. Cinq refus consécutifs donnent la victoire aux Ombres.</li><li>Les membres de l’équipe agissent en secret. Un Agent doit réussir ; une Ombre peut réussir ou saboter. Un seul sabotage fait échouer la mission.</li><li>Après chaque mission, le capitaine change. Trois missions réussies : victoire des Agents. Trois échecs : victoire des Ombres.</li></ol><p>Discutez dans le chat ou dans votre appel vocal habituel. Ne partagez pas votre écran quand vous consultez votre rôle !</p></div></details>
    <footer><span>Entre nous · Première version jouable</span><span>Salons conservés 24 h après la dernière action.</span></footer></main>;
}
