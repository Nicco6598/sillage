import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION - Modern Animated Gradient */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
          {/* Animated Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-highlight/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-text-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--text-muted)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--text-muted)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-page flex flex-col items-center text-center">
            <span className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              Il database italiano delle fragranze
            </span>

            <h1 className="max-w-4xl font-serif text-6xl font-medium leading-[1.1] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl text-balance">
              Scopri il tuo<br />
              <span className="italic">profumo.</span>
            </h1>

            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row">
              <Link
                href="/explore"
                className="group flex h-14 items-center gap-4 border-b-2 border-text-primary pb-1 text-lg font-medium text-text-primary transition-all hover:border-text-secondary hover:text-text-secondary"
              >
                Esplora Collezione
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-16 w-[1px] bg-text-muted/30"></div>
        </div>
      </section>

      {/* SEZIONE 1: EDITORIAL STATEMENT */}
      <section className="py-24 sm:py-32 bg-bg-primary text-text-primary">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight">
              L'arte della profumeria, <span className="italic text-text-secondary">decodificata.</span>
            </h2>
          </div>
          <div>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed text-balance">
              Sillage è la destinazione definitiva per gli amanti delle fragranze.
              Esplora oltre 24.000 profumi, leggi recensioni autentiche e
              trova la tua firma olfattiva attraverso un viaggio sensoriale curato.
            </p>
            <div className="mt-8 flex gap-12 border-t border-border-primary pt-8">
              <div>
                <span className="block font-serif text-4xl mb-2">24k+</span>
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Fragranze</span>
              </div>
              <div>
                <span className="block font-serif text-4xl mb-2">50k+</span>
                <span className="text-xs font-mono uppercase tracking-widest text-text-muted">Utenti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEZIONE 2: TRENDING (Minimal Grid) */}
      <section className="py-24 border-t border-border-primary bg-bg-secondary">
        <div className="container-page">
          <div className="flex items-end justify-between mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl">Trending Now</h2>
            <Link href="/explore?sort=trending" className="hidden sm:flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-text-primary hover:text-text-secondary transition-colors">
              Vedi tutto <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {/* Mock Item 1 */}
            <Link href="/fragrance/1" className="group block cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-bg-tertiary">
                {/* Placeholder for image or just color block for minimal look */}
                <div className="h-full w-full bg-zinc-200 dark:bg-zinc-800 transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-text-primary group-hover:underline decoration-1 underline-offset-4">Bleu de Chanel</h3>
                  <p className="text-sm text-text-secondary mt-1">Chanel</p>
                </div>
                <span className="text-sm font-mono text-text-primary">4.8 ★</span>
              </div>
            </Link>

            {/* Mock Item 2 */}
            <Link href="/fragrance/2" className="group block cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-bg-tertiary">
                <div className="h-full w-full bg-stone-200 dark:bg-stone-800 transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-text-primary group-hover:underline decoration-1 underline-offset-4">Sauvage Elixir</h3>
                  <p className="text-sm text-text-secondary mt-1">Dior</p>
                </div>
                <span className="text-sm font-mono text-text-primary">4.9 ★</span>
              </div>
            </Link>

            {/* Mock Item 3 */}
            <Link href="/fragrance/3" className="group block cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden bg-bg-tertiary">
                <div className="h-full w-full bg-zinc-300 dark:bg-zinc-700 transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-text-primary group-hover:underline decoration-1 underline-offset-4">Oud Wood</h3>
                  <p className="text-sm text-text-secondary mt-1">Tom Ford</p>
                </div>
                <span className="text-sm font-mono text-text-primary">4.7 ★</span>
              </div>
            </Link>
          </div>

          <div className="mt-16 text-center sm:hidden">
            <Link href="/explore" className="text-sm font-medium uppercase tracking-widest underline underline-offset-4">Vedi tutti i trending</Link>
          </div>
        </div>
      </section>

      {/* SEZIONE 3: CATEGORIES (Large visual blocks) */}
      <section className="py-24 bg-bg-primary border-t border-border-primary">
        <div className="container-page">
          <h2 className="font-serif text-4xl sm:text-5xl mb-16 text-center">Esplora per Categoria</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/explore?category=niche" className="relative h-[60vh] group overflow-hidden bg-black text-white">
              <div className="absolute inset-0 bg-neutral-900 group-hover:bg-neutral-800 transition-colors duration-500" />
              {/* Image would go here as bg */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <span className="font-mono text-xs uppercase tracking-widest mb-4 opacity-70">Curated</span>
                <h3 className="font-serif text-5xl md:text-6xl italic group-hover:scale-110 transition-transform duration-700">Nicchia</h3>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white pb-1">
                  Scopri <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <Link href="/explore?category=designer" className="relative h-[60vh] group overflow-hidden bg-white text-black border border-border-primary">
              <div className="absolute inset-0 bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                <span className="font-mono text-xs uppercase tracking-widest mb-4 text-neutral-500">Popular</span>
                <h3 className="font-serif text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-700">Designer</h3>
                <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 text-sm uppercase tracking-widest border-b border-black pb-1">
                  Scopri <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SEZIONE 4: COMMUNITY CTA */}
      <section className="py-32 bg-bg-secondary text-center border-t border-border-primary">
        <div className="container-page max-w-3xl mx-auto">
          <Sparkles className="h-8 w-8 mx-auto mb-8 text-text-primary" />
          <h2 className="font-serif text-4xl sm:text-6xl mb-8">La tua opinione conta.</h2>
          <p className="text-xl text-text-secondary leading-relaxed mb-12">
            Unisciti alla conversazione globale sulle fragranze. Condividi le tue esperienze,
            leggi recensioni oneste e costruisci la tua collezione digitale.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/register" className="bg-text-primary text-bg-primary px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-text-secondary transition-colors">
              Registrati Ora
            </Link>
            <Link href="/community" className="border border-border-strong px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-bg-tertiary transition-colors">
              Vedi Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
