'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  GROUP_COLORS,
  NODE_BY_ID,
  ROUTES,
  STATIONS,
  UNIQUE_NODES
} from '@/lib/metro-board.mjs';


type Player = {
  id: string;
  name: string;
  ready: boolean;
};

type Position = {
  station?: string;
  route?: string;
  index?: number;
};

type MetroGame = {
  phase: string;
  order: string[];
  round: number;
  current: string;
  money: Record<string, number>;
  positions: Record<string, Position>;
  owners: Record<string, string>;
  bankrupt: string[];
  rolled: number | null;
  pending: {
    node?: string;
    price?: number;
  } | null;
  lastEvent: string;
  lastLanding: string | null;
  winner: string | null;
  reason: string | null;
  revision: number;
  worth: Record<string, number>;
};

type Room = {
  code: string;
  host: string;
  me: string;
  players: Player[];
  messages: {
    id: string;
    name: string;
    text: string;
  }[];
  game: MetroGame | null;
};

type Session = {
  code: string;
  token: string;
};

const TOKEN_COLORS = [
  '#ef493d',
  '#196bd5',
  '#159663',
  '#f2b92d',
  '#9c4dcc',
  '#202a28'
];

type BoardNode = {
  id: string;
  name: string;
  x: number;
  y: number;
  type: string;
  group?: string;
  price?: number;
  rent?: number;
};

const stations = STATIONS as Record<
  string,
  {
    id: string;
    name: string;
    x: number;
    y: number;
    next: string[];
  }
>;

const routes = ROUTES as Record<
  string,
  {
    name: string;
    from: string;
    to: string;
    nodes: BoardNode[];
  }
>;

const nodes = NODE_BY_ID as Record<string, BoardNode>;

const groupColors = GROUP_COLORS as Record<string, string>;

const visualNodes = UNIQUE_NODES as BoardNode[];


export default function Metropole() {

  const [room, setRoom] = useState<Room | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const [message, setMessage] = useState('');

  const lock = useRef(false);
  const revision = useRef(0);


  /* =========================================================
     SESSION
     ========================================================= */

  useEffect(() => {

    const invite =
      new URLSearchParams(window.location.search).get('code');

    let saved: Session | null = null;

    try {
      saved = JSON.parse(
        sessionStorage.getItem('metropole') || 'null'
      );
    } catch {}

    queueMicrotask(() => {

      if (invite) {
        setCode(invite.toUpperCase());
      }

      if (
        saved?.code &&
        saved?.token &&
        (!invite || invite.toUpperCase() === saved.code)
      ) {
        setSession(saved);
      }

    });

  }, []);


  /* =========================================================
     SYNCHRONISATION MULTIJOUEUR
     ========================================================= */

  useEffect(() => {

    if (!session) return;

    let active = true;
    let polling = false;

    const refresh = async () => {

      if (lock.current || polling) return;

      polling = true;

      const rev = revision.current;

      try {

        const response = await fetch('/api/metro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`
          },
          body: JSON.stringify({
            action: 'state',
            code: session.code
          })
        });

        const data = await response.json();

        if (
          !active ||
          rev !== revision.current ||
          lock.current
        ) {
          return;
        }

        if (!response.ok) {

          setError(data.error);

          if (response.status === 400) {

            setRoom(null);
            setSession(null);

            sessionStorage.removeItem('metropole');

          }

          return;
        }

        setRoom(data.room);
        setError('');

      } catch {

        if (active && !lock.current) {
          setError(
            'Connexion interrompue. Nouvelle tentative…'
          );
        }

      } finally {

        polling = false;

      }

    };

    void refresh();

    const timer = setInterval(refresh, 1400);

    return () => {
      active = false;
      clearInterval(timer);
    };

  }, [session]);


  /* =========================================================
     ACTION SERVEUR
     ========================================================= */

  async function action(
    actionName: string,
    fields: Record<string, unknown> = {}
  ) {

    if (busy || lock.current) return;

    lock.current = true;

    revision.current++;

    setBusy(true);
    setError('');

    try {

      const response = await fetch('/api/metro', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          ...(session
            ? {
                Authorization: `Bearer ${session.token}`
              }
            : {})
        },

        body: JSON.stringify({

          action: actionName,

          code: session?.code ?? code,

          name,

          revision:
            room?.game?.revision ?? 0,

          ...fields

        })

      });


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.error);
      }


      if (data.token) {

        const next = {
          code: data.room.code,
          token: data.token
        };

        sessionStorage.setItem(
          'metropole',
          JSON.stringify(next)
        );

        setSession(next);

      }


      setRoom(data.room);


      if (actionName === 'chat') {
        setMessage('');
      }


      if (actionName === 'leave') {

        setSession(null);

        sessionStorage.removeItem(
          'metropole'
        );

      }

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'Action impossible.'
      );

    } finally {

      lock.current = false;
      setBusy(false);

    }

  }


  /* =========================================================
     DONNÉES DE PARTIE
     ========================================================= */

  const g = room?.game;

  const playerName = (
    id?: string | null
  ) =>
    room?.players.find(
      p => p.id === id
    )?.name ?? '?';


  const me =
    room?.players.find(
      p => p.id === room.me
    );


  const myTurn =
    g?.current === room?.me;


  const myProperties =
    g
      ? Object.entries(g.owners)

          .filter(
            ([, owner]) =>
              owner === room?.me
          )

          .map(
            ([id]) => nodes[id]
          )

      : [];


  /* =========================================================
     POSITIONNEMENT
     ========================================================= */

  function nodeStyle(
    node: {
      x: number;
      y: number;
    }
  ) {

    return {
      left: `${node.x}%`,
      top: `${node.y}%`
    };

  }


  function positionOf(
    pos: Position
  ) {

    if (pos.station) {
      return stations[pos.station];
    }

    if (
      pos.route &&
      typeof pos.index === 'number'
    ) {
      return routes[pos.route]
        .nodes[pos.index];
    }

    return stations.central;

  }


  /* =========================================================
     INVITATION
     ========================================================= */

  async function copyInvite() {

    const url =
      `${window.location.origin}` +
      `/metropole?code=${room?.code}`;

    try {

      await navigator.clipboard
        .writeText(url);

      setNotice('Lien copié.');

    } catch {

      setNotice(url);

    }

  }


  /* =========================================================
     CHAT
     ========================================================= */

  function sendChat(
    e: FormEvent
  ) {

    e.preventDefault();

    void action(
      'chat',
      {
        text: message
      }
    );

  }


  const sellProperty =
    (nodeId: string) =>
      () => {

        void action(
          'sell',
          {
            node: nodeId
          }
        );

      };


  /* =========================================================
     AFFICHAGE
     ========================================================= */

  return (

    <main className="metro-shell">


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <header className="metro-nav">

        <Link
          href="/"
          className="metro-brand"
        >

          <span>M</span>

          MÉTROPOLE

        </Link>


        <b>
          LA VILLE EST À VOUS
        </b>


        <Link href="/">
          ← Jeux
        </Link>

      </header>


      {error && (

        <div
          className="metro-alert"
          role="alert"
        >

          {error}

        </div>

      )}


      {/* =====================================================
          PAGE D'ENTRÉE
          ===================================================== */}

      {!room ? (

        <section className="metro-entry">


          <div
            className="skyline"
            aria-hidden="true"
          >
            ▥ ▤ ▥ ▦ ▤
          </div>


          <p>
            IMMOBILIER · STRATÉGIE · ITINÉRAIRES
          </p>


          <h1>

            BÂTISSEZ

            <br />

            <i>
              VOTRE VILLE
            </i>

          </h1>


          <p className="metro-lead">

            Choisissez vos routes,
            achetez les meilleurs quartiers

            <br />

            et devenez la référence
            de la métropole.

          </p>


          <div className="metro-ticket">


            <label htmlFor="metro-name">
              Nom de l’investisseur
            </label>


            <input
              id="metro-name"
              value={name}
              onChange={
                e =>
                  setName(
                    e.target.value
                  )
              }
              maxLength={20}
              placeholder="Votre pseudo"
            />


            <div>


              <button
                disabled={
                  busy ||
                  name.trim().length < 2
                }
                onClick={
                  () =>
                    action('create')
                }
              >
                Fonder une ville
              </button>


              <span>
                OU
              </span>


              <input
                aria-label="Code de la ville"
                value={code}
                maxLength={8}
                onChange={
                  e =>
                    setCode(
                      e.target.value
                        .toUpperCase()
                        .replace(/\s/g, '')
                    )
                }
                placeholder="CODE"
              />


              <button
                className="metro-light"
                disabled={
                  busy ||
                  name.trim().length < 2 ||
                  code.length !== 8
                }
                onClick={
                  () =>
                    action('join')
                }
              >
                Rejoindre
              </button>


            </div>

          </div>

        </section>

      ) : (

        <>


          {/* =================================================
              TITRE
              ================================================= */}

          <section className="metro-heading">

            <div>

              <small>
                PLAN DE DÉVELOPPEMENT N° {room.code}
              </small>

              <h1>
                MÉTROPOLE
              </h1>

            </div>


            <button
              className="metro-light"
              onClick={copyInvite}
            >
              Inviter des investisseurs ↗
            </button>

          </section>


          <p className="metro-notice">
            {notice}
          </p>


          <div className="metro-layout">


            {/* ===============================================
                JOUEURS
                =============================================== */}

            <aside className="metro-players">

              <h2>
                INVESTISSEURS
              </h2>


              {room.players.map(
                (p, i) => (

                  <div
                    className={
                      `metro-player ${
                        g?.bankrupt.includes(p.id)
                          ? 'out'
                          : ''
                      }`
                    }
                    key={p.id}
                  >

                    <span
                      style={{
                        background:
                          TOKEN_COLORS[i]
                      }}
                    >
                      {p.name
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>


                    <div>

                      <b>

                        {p.name}

                        {p.id === room.me
                          ? ' · VOUS'
                          : ''}

                      </b>


                      <small>

                        {g

                          ? g.bankrupt.includes(
                              p.id
                            )

                            ? 'FAILLITE'

                            : `${g.money[p.id]} M · patrimoine ${g.worth[p.id]} M`

                          : p.ready

                            ? 'PRÊT'

                            : p.id === room.host

                              ? 'HÔTE'

                              : 'EN ATTENTE'
                        }

                      </small>

                    </div>


                    {g?.current === p.id && (

                      <i>
                        JOUE
                      </i>

                    )}

                  </div>

                )
              )}


              {(!g ||
                g.phase === 'finished') && (

                <button
                  className="metro-text"
                  onClick={
                    () =>
                      action('leave')
                  }
                >
                  Quitter la ville
                </button>

              )}


              {/* =============================================
                  PATRIMOINE
                  ============================================= */}

              {g && (

                <div className="portfolio">

                  <h3>
                    MON PATRIMOINE
                  </h3>


                  {myProperties.length

                    ? myProperties.map(
                        n => (

                          <div key={n.id}>

                            <span
                              style={{
                                background:
                                  groupColors[
                                    n.group ?? ''
                                  ] ??
                                  '#42cbd1'
                              }}
                            />


                            <b>
                              {n.name}
                            </b>


                            {g.phase ===
                              'debt' &&
                              myTurn && (

                                <button
                                  onClick={
                                    sellProperty(
                                      n.id
                                    )
                                  }
                                >

                                  Vendre{' '}

                                  {Math.floor(
                                    (n.price ??
                                      220) /
                                      2
                                  )}{' '}

                                  M

                                </button>

                              )}

                          </div>

                        )
                      )

                    : (

                      <p>
                        Aucun bien pour le moment.
                      </p>

                    )
                  }

                </div>

              )}

            </aside>


            {/* ===============================================
    PLATEAU
    =============================================== */}

<section className="metro-board-wrap">

  <div
    className="metro-board"
    aria-label="Plateau de la Métropole"
  >

    {/* ===========================================
        OSSATURE VISUELLE

        5 rectangles indépendants :
        - principal
        - nord
        - ouest
        - est
        - sud
        =========================================== */}


    {/* ===========================================
        GARES / CARREFOURS
        =========================================== */}

    {Object.values(stations).map(
      s => (

        <div
          key={s.id}
          className={`metro-node station station-${s.id}`}
          style={nodeStyle(s)}
          title={s.name}
        >

          <span>
            ◆
          </span>

          <small>
            {s.name}
          </small>

        </div>

      )
    )}


    {/* ===========================================
        CASES
        =========================================== */}

    {visualNodes.map(
      node => (

        <div
          key={node.id}

          className={
            `metro-node ${node.type}`
          }

          style={{

            ...nodeStyle(node),

            ...(node.group
              ? {
                  '--district':
                    groupColors[
                      node.group
                    ]
                } as React.CSSProperties
              : {})

          }}

          title={
            `${node.name}${
              node.price
                ? ` · ${node.price} M`
                : ''
            }`
          }
        >

          <span>

            {
              node.type === 'event'

                ? '?'

                : node.type === 'salary'

                  ? '+'

                  : node.type === 'bank'

                    ? 'B'

                    : node.type === 'company'

                      ? 'C'

                      : ''
            }

          </span>


          {g?.owners[node.id] && (

            <i
              style={{
                background:
                  TOKEN_COLORS[
                    room.players.findIndex(
                      p =>
                        p.id ===
                        g.owners[node.id]
                    )
                  ]
              }}
            />

          )}

        </div>

      )
    )}


    {/* ===========================================
        PIONS
        =========================================== */}

    {g &&
      room.players.map(
        (p, i) => {

          const pos =
            positionOf(
              g.positions[p.id]
            );

          return (

            <div
              key={p.id}

              className="metro-token"

              style={{

                ...nodeStyle(pos),

                background:
                  TOKEN_COLORS[i],

                transform:
                  `translate(${
                    (i % 3 - 1) *
                      7 -
                    50
                  }%, ${
                    Math.floor(
                      i / 3
                    ) *
                      8 -
                    50
                  }%)`

              }}

              title={p.name}
            >

              {p.name
                .slice(0, 1)
                .toUpperCase()}

            </div>

          );

        }
      )
    }


    {/* ===========================================
        LÉGENDE
        =========================================== */}

    <div className="board-legend">

      <span>
        <i className="lg-property" />
        Quartier
      </span>

      <span>
        <i className="lg-station" />
        Gare
      </span>

      <span>
        <i className="lg-company" />
        Entreprise
      </span>

      <span>
        <i className="lg-event" />
        Événement
      </span>

    </div>

  </div>


  {/* =============================================
      AVANT LA PARTIE
      ============================================= */}

  {!g ? (

    <div className="metro-action">

      <p>
        Réunissez 2 à 6 investisseurs.
      </p>

      <button
        onClick={
          () =>
            action('ready')
        }
      >
        {me?.ready
          ? 'Je ne suis plus prêt'
          : 'Je suis prêt'}
      </button>

      {room.host === room.me && (

        <button
          className="metro-light"

          disabled={
            busy ||
            room.players.length < 2 ||
            !room.players.every(
              p => p.ready
            )
          }

          onClick={
            () =>
              action('start')
          }
        >
          Lancer la partie →
        </button>

      )}

    </div>

  ) : (

    <div className="metro-action">

      <header>

        <span>
          JOUR {g.round}/20
        </span>

        <b>
          AU TOUR DE{' '}
          {playerName(
            g.current
          ).toUpperCase()}
        </b>

        {g.rolled && (
          <i>
            DÉ : {g.rolled}
          </i>
        )}

      </header>


      <p className="city-news">
        {g.lastEvent}
      </p>


      {/* CHOIX DE ROUTE */}

      {g.phase === 'route' &&
        myTurn && (

        <>

          <h3>
            Quelle direction prenez-vous ?
          </h3>

          <div className="route-options">

            {stations[
              g.positions[
                room.me
              ].station!
            ].next.map(
              (id: string) => (

                <button
                  key={id}

                  onClick={
                    () =>
                      action(
                        'choose-route',
                        {
                          route: id
                        }
                      )
                  }
                >

                  {routes[id].name}

                  <small>
                    {
                      routes[id]
                        .nodes
                        .length
                    }{' '}
                    cases
                  </small>

                </button>

              )
            )}

          </div>

        </>

      )}


      {/* DÉ */}

      {g.phase === 'roll' &&
        myTurn && (

        <button
          className="roll-button"
          disabled={busy}

          onClick={
            () =>
              action('roll')
          }
        >
          Lancer le dé
        </button>

      )}


      {/* ACHAT */}

      {g.phase === 'purchase' &&
        myTurn &&
        g.pending?.node && (

        <div className="purchase-card">

          <span
            style={{
              background:
                groupColors[
                  nodes[
                    g.pending.node
                  ].group ?? ''
                ] ??
                '#42cbd1'
            }}
          />

          <h3>
            {
              nodes[
                g.pending.node
              ].name
            }
          </h3>

          <p>
            Prix:{' '}

            <b>
              {g.pending.price} M
            </b>

            {' · '}

            Loyer:{' '}

            <b>
              {
                nodes[
                  g.pending.node
                ].rent ?? 55
              }{' '}
              M
            </b>
          </p>

          <button
            disabled={
              g.money[room.me] <
              g.pending.price!
            }

            onClick={
              () =>
                action('buy')
            }
          >
            Acheter
          </button>

          <button
            className="metro-light"

            onClick={
              () =>
                action('skip')
            }
          >
            Passer
          </button>

        </div>

      )}


      {/* DETTE */}

      {g.phase === 'debt' &&
        myTurn && (

        <div className="debt-card">

          <h3>
            Trésorerie négative
          </h3>

          <p>
            Vendez un bien depuis votre patrimoine ou déclarez la faillite.
          </p>

          <button
            onClick={
              () =>
                action('bankrupt')
            }
          >
            Déclarer la faillite
          </button>

        </div>

      )}


      {/* FIN */}

      {g.phase === 'finished' && (

        <div className="metro-victory">

          <p>
            LA VILLE A CHOISI
          </p>

          <h2>
            {playerName(
              g.winner
            )}{' '}
            remporte Métropole !
          </h2>

          <p>
            {g.reason}
          </p>

          {room.host === room.me && (

            <button
              onClick={
                () =>
                  action('reset')
              }
            >
              Nouvelle ville
            </button>

          )}

        </div>

      )}


      {!myTurn &&
        g.phase !== 'finished' && (

        <p className="waiting-turn">

          Observez le marché pendant que{' '}

          {playerName(
            g.current
          )}{' '}

          joue…

        </p>

      )}

    </div>

  )}

</section>



            {/* ===============================================
                CHAT
                =============================================== */}

            <aside className="metro-chat">

              <h2>
                CAFÉ DES AFFAIRES
              </h2>


              <div>

                {room.messages.length ===
                  0 && (

                  <p>
                    Les négociations peuvent commencer…
                  </p>

                )}


                {room.messages.map(
                  m => (

                    <p key={m.id}>

                      <b>
                        {m.name}
                      </b>

                      {m.text}

                    </p>

                  )
                )}

              </div>


              <form
                onSubmit={sendChat}
              >

                <input
                  aria-label="Message"
                  value={message}
                  maxLength={400}
                  onChange={
                    e =>
                      setMessage(
                        e.target.value
                      )
                  }
                  placeholder="Proposer un marché…"
                />

                <button
                  disabled={
                    busy ||
                    !message.trim()
                  }
                >
                  ↑
                </button>

              </form>

            </aside>

          </div>

        </>

      )}


      {/* =====================================================
          RÈGLES
          ===================================================== */}

      <details className="metro-rules">

        <summary>
          Règles de Métropole
        </summary>

        <div>

          <p>
            Chaque tour, choisissez votre itinéraire à la gare puis lancez le dé.
            Achetez les quartiers disponibles et percevez un loyer quand un
            adversaire s’y arrête. Posséder tout un quartier coloré double ses
            loyers.
          </p>

          <p>
            Les cases Entreprise peuvent être achetées pour 220 M, les cases
            Salaire versent 200 M, les Banques et Événements modifient votre
            trésorerie. En cas de dette, vendez des biens à moitié prix ou
            déclarez la faillite. Le dernier investisseur solvable gagne ; après
            vingt jours, le patrimoine le plus élevé l’emporte.
          </p>

        </div>

      </details>

    </main>

  );

}