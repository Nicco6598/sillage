# Sillage

**Sillage** è il nuovo punto di riferimento digitale per la profumeria artistica in Italia. Una piattaforma premium progettata per esplorare, recensire e collezionare fragranze, unendo un'estetica curata a prestazioni tecnologiche d'avanguardia.

## 🚀 Visione & Stack Tecnologico

Il progetto nasce con l'obiettivo di "umanizzare" la tecnologia, mettendola al servizio di un'arte sensoriale. Per farlo, abbiamo scelto uno stack moderno e orientato alle performance:

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS + Motion (per micro-interazioni premium)
- **AI:** Google Gemini (per la moderazione intelligente dei contenuti)
- **Infrastructure:** Upstash (Redis & Rate-limiting)

---

## 🏛️ Decisioni Architetturali

In Sillage, ogni scelta tecnica è stata guidata dalla ricerca dell'equilibrio tra **Performance**, **Type-Safety** e **Developer Experience**.

### 🛠️ Perché Drizzle ORM?
Abbiamo preferito **Drizzle** rispetto a alternative più massicce (come Prisma) per diversi motivi:
1.  **Zero Overhead:** Drizzle non ha una "runtime" pesante. Ciò che scrivi è molto vicino all'SQL puro, garantendo query fulminee.
2.  **Type-Safety Nativa:** Essendo "TypeScript-first", Drizzle ci permette di avere una sincronizzazione perfetta tra lo schema del database e i tipi del frontend, riducendo drasticamente i bug in produzione.
3.  **Edge-Ready:** La sua leggerezza ci permette di eseguire il codice su infrastrutture Edge senza compromettere i tempi di "cold start".

### ⚡ Perché Server Actions?
Invece di costruire una REST API tradizionale, abbiamo adottato le **Next.js Server Actions** per gestire le interazioni (come l'invio di recensioni o la gestione del profilo):
1.  **Seamless Integration:** Le azioni server eliminano la necessità di gestire endpoint API manuali e fetch complessi nel client.
2.  **Unified Validation:** Utilizziamo Zod per validare i dati una sola volta, sia nel client che nel server, garantendo coerenza e sicurezza.
3.  **Progressive Enhancement:** Le Server Actions permettono alla piattaforma di mantenere funzionalità di base anche in scenari con connettività limitata, migliorando l'accessibilità complessiva.

---

## ✨ Funzionalità Chiave

- **Database Olfattivo:** Navigazione avanzata per brand, note e piramidi olfattive.
- **AI Moderation:** Sistema di recensioni protetto da AI per mantenere un tono costruttivo e rispettoso nella community.
- **Security First:** Protezione anti-spam avanzata con validazione email e rate-limiting granulare.
- **Design 3D & Depth:** Un'interfaccia "glassmorphic" con ombre morbide e gradienti studiati per un feedback visivo di alto profilo.

## 🛠️ Sviluppo Locale

1.  Clona il repository.
2.  Installa le dipendenze:
    ```bash
    pnpm install
    ```
3.  Configura le variabili d'ambiente nel file `.env.local` (Supabase, Gemini API, Upstash).
4.  Avvia il server di sviluppo:
    ```bash
    pnpm dev
    ```

---

Creato con passione per la community olfattiva italiana.
