# Sillage

**Sillage** è la piattaforma premium per la profumeria artistica in Italia: esplorazione, recensioni e collezione di fragranze con un'esperienza digitale curata e performance di livello enterprise.

## 🥇 Top 3 — Valore del prodotto

1. **Mappa olfattiva completa:** ricerca avanzata per brand, note e piramidi per scoprire e confrontare fragranze con precisione.
2. **Community affidabile:** recensioni protette da moderazione AI per mantenere un tono costruttivo e informazioni di qualità.
3. **Esperienza premium:** interfaccia glassmorphic, micro-interazioni fluide e feedback visivo di alto profilo.

## 🥈 Top 3 — Scelte tecniche che contano

1. **Stack moderno e performante:** Next.js 16 (App Router), Supabase (PostgreSQL), Drizzle ORM, Tailwind CSS + Motion.
2. **Type-safety end‑to‑end:** schema e tipi allineati con Drizzle per ridurre errori e accelerare lo sviluppo.
3. **Architettura essenziale:** Server Actions per eliminare boilerplate API, validazione unificata con Zod e readiness per ambienti Edge.

## 🔬 Dettagli tecnici

- **Struttura applicativa:** App Router con rendering ibrido, pagine server-first e componenti client per interazioni dinamiche.
- **Persistenza dati:** Supabase Postgres con schema tipizzato via Drizzle, query composabili e migrazioni versionate.
- **Flussi core:** esplorazione catalogo, scheda fragranza, collezione personale, recensioni con moderazione, discovery.
- **UI/UX:** design system minimale in Tailwind, motion per micro‑interazioni e feedback di stato chiari.
- **Performance:** query snelle, componenti modulari, asset ottimizzati e attenzione ai tempi di caricamento.
- **Affidabilità:** rate‑limiting con Upstash, validazioni Zod e controllo contenuti assistito da AI.

## 🧩 Moduli principali

- **Explore:** filtri multi‑criterio e ricerca per note/brand/accordi.
- **Fragrance Detail:** scheda completa con voti community e insight olfattivi.
- **Collection & Favorites:** gestione stato collezione e preferiti con azioni atomiche.
- **Reviews:** CRUD con moderazione e protezioni anti‑abuso.
- **Auth & Profile:** registrazione, login e gestione profilo con Supabase.

## ⚙️ Scripts

- `pnpm dev` avvia il server di sviluppo
- `pnpm build` compila la build di produzione
- `pnpm start` avvia la build
- `pnpm lint` esegue ESLint

## 🥉 Top 3 — Affidabilità & Operatività

1. **Security first:** rate‑limiting con Upstash, validazioni robuste e protezioni anti‑spam.
2. **Moderazione intelligente:** Google Gemini per filtrare contenuti problematici e proteggere la qualità della community.
3. **Setup in 3 passi:**
   1. Installa le dipendenze:
      ```bash
      pnpm install
      ```
   2. Configura `.env.local` (Supabase, Gemini API, Upstash).
   3. Avvia lo sviluppo:
      ```bash
      pnpm dev
      ```
