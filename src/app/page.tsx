import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getDatabaseStats, getFeaturedBrands } from "@/lib/fragrance-db";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch only lightweight data
  const [stats, featuredBrands] = await Promise.all([
    getDatabaseStats(),
    getFeaturedBrands(4),
  ]);

  return (
    <div className="flex flex-col w-full">
      <section className="relative min-h-screen w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-bg-primary">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <div className="container-page relative z-10 flex flex-col items-center text-center py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-border-primary mb-10">
            <Sparkles className="h-3 w-3 text-gold" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Il database italiano delle fragranze
            </span>
          </div>

          <h1 className="max-w-4xl font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8">
            Scopri il tuo <br />
            <span className="italic text-copper">profumo.</span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed mb-12">
            Esplora, recensisci e colleziona oltre {stats.fragrances.toLocaleString()} fragranze
            in un&apos;esperienza curata per veri appassionati.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/explore"
              className="group px-8 py-4 bg-text-primary text-text-inverted hover:bg-copper transition-colors"
            >
              <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest">
                Esplora Collezione
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/brands"
              className="px-8 py-4 border border-border-primary text-text-primary hover:border-copper hover:text-copper transition-colors text-xs uppercase tracking-widest"
            >
              Scopri i Brand
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-border-primary flex flex-wrap justify-center gap-12 md:gap-16">
            <div className="text-center">
              <span className="block font-serif text-4xl md:text-5xl text-copper">{stats.fragrances.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Fragranze</span>
            </div>
            <div className="text-center">
              <span className="block font-serif text-4xl md:text-5xl text-gold">{stats.brands.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Brand</span>
            </div>
            <div className="text-center">
              <span className="block font-serif text-4xl md:text-5xl text-rose-gold">{stats.notes.toLocaleString()}</span>
              <span className="text-[10px] uppercase tracking-widest text-text-muted">Note</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-text-muted opacity-50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-text-muted to-transparent" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border-primary">
        <div className="container-page">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-copper" />
              <h2 className="font-serif text-3xl md:text-4xl">Brand in Evidenza</h2>
            </div>
            <Link
              href="/brands"
              className="hidden sm:flex items-center gap-2 text-sm text-text-secondary hover:text-copper transition-colors"
            >
              <span>Tutti i brand</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredBrands.map((brand, i) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group relative p-8 border border-border-primary bg-bg-secondary/30 hover:border-copper transition-all duration-300 card-3d"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />

                <span className="absolute top-4 left-4 text-xs font-mono text-text-muted z-10">
                  0{i + 1}
                </span>

                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-copper transition-all z-10" />

                <div className="pt-8 relative z-10">
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-copper transition-colors">
                    {brand.name}
                  </h3>
                  {brand.country && (
                    <p className="text-sm text-text-muted mb-4">{brand.country}</p>
                  )}
                  <span className="text-xs font-mono text-text-tertiary">
                    {brand.fragranceCount} fragranze
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-0 h-px bg-copper group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-bg-secondary border-t border-border-primary">
        <div className="container-page">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-serif text-3xl md:text-4xl">Esplora per Categoria</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/explore"
              className="group relative h-64 md:h-80 overflow-hidden bg-bg-primary border border-border-primary hover:border-copper shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent dark:from-white/[0.02] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  {stats.fragrances.toLocaleString()}+ profumi
                </span>
                <h3 className="font-serif text-3xl md:text-4xl mb-4 group-hover:text-copper transition-colors">
                  Tutte le Fragranze
                </h3>
                <div className="flex items-center gap-2 text-sm text-text-muted group-hover:text-copper transition-colors">
                  <span className="uppercase tracking-widest">Esplora</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border-primary">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-8 text-copper" />
            <h2 className="font-serif text-4xl md:text-6xl mb-6">
              Unisciti alla community<span className="text-copper">.</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-10">
              Condividi le tue esperienze, scopri nuove fragranze e costruisci la tua collezione digitale
              insieme a migliaia di appassionati.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="group px-8 py-4 bg-text-primary text-text-inverted hover:bg-copper transition-colors"
              >
                <span className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                  Registrati Ora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/community"
                className="px-8 py-4 border border-border-primary text-text-primary hover:border-copper hover:text-copper transition-colors text-xs uppercase tracking-widest"
              >
                Esplora Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
