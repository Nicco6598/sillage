import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION - Modern Dynamic */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-bg-primary transition-colors duration-500">
          {/* Gradient Orbs - Using CSS variables for theme adaptation */}
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-900/20 dark:to-purple-900/20 blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 blur-[100px] animate-pulse-slow delay-1000" />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Content */}
        <div className="container-page relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary border border-border-primary mb-8 animate-fade-in-up">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">
              Il database italiano delle fragranze
            </span>
          </div>

          <h1 className="max-w-5xl font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8 text-text-primary animate-fade-in-up delay-100">
            Scopri il tuo <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-secondary to-text-primary bg-300% animate-gradient">
              profumo.
            </span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed mb-12 animate-fade-in-up delay-200">
            Esplora, recensisci e colleziona oltre 24.000 fragranze in un'esperienza digitale curata per veri appassionati.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <Link
              href="/explore"
              className="group relative px-8 py-3 bg-text-primary text-bg-primary overflow-hidden transition-all hover:bg-text-secondary"
            >
              <span className="relative flex items-center gap-3 text-xs font-medium uppercase tracking-widest">
                Esplora Collezione
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/community"
              className="px-8 py-3 text-text-primary border border-text-primary hover:bg-text-primary hover:text-bg-primary transition-all text-xs font-medium uppercase tracking-widest"
            >
              Community
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce delay-1000">
          <div className="flex flex-col items-center gap-2 text-text-muted opacity-50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-text-muted to-transparent"></div>
          </div>
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
            <Link
              href="/register"
              className="group flex items-center gap-3 border-b border-text-primary pb-1 text-sm uppercase tracking-widest font-medium hover:text-text-secondary hover:border-text-secondary transition-all"
            >
              Registrati Ora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/community"
              className="group flex items-center gap-3 border-b border-transparent pb-1 text-sm uppercase tracking-widest font-medium text-text-secondary hover:text-text-primary hover:border-text-primary transition-all"
            >
              Vedi Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
