import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getDatabaseStats, getFeaturedBrands } from "@/lib/fragrance-db";

export default async function Home() {
  // Fetch only lightweight data
  const [stats, featuredBrands] = await Promise.all([
    getDatabaseStats(),
    getFeaturedBrands(4),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-20">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-bg-primary">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        {/* Content */}
        <div className="container-page relative z-10 flex flex-col items-center text-center py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-border-primary mb-10">
            <Sparkles className="h-3 w-3 text-gold" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
              Il database italiano delle fragranze
            </span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-8">
            Scopri il tuo <br />
            <span className="italic text-copper">profumo.</span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-text-secondary leading-relaxed mb-12">
            Esplora, recensisci e colleziona oltre {stats.fragrances.toLocaleString()} fragranze
            in un'esperienza curata per veri appassionati.
          </p>

          {/* CTAs */}
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

          {/* Stats */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-text-muted opacity-50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="h-10 w-px bg-gradient-to-b from-text-muted to-transparent" />
          </div>
        </div>
      </section>

      {/* SECTION: FEATURED BRANDS */}
      <section className="py-24 md:py-32 border-t border-border-primary">
        <div className="container-page">
          {/* Section Header */}
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

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredBrands.map((brand, i) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group relative p-8 border border-border-primary bg-bg-secondary/30 hover:border-copper transition-all duration-300"
              >
                {/* Number */}
                <span className="absolute top-4 left-4 text-xs font-mono text-text-muted">
                  0{i + 1}
                </span>

                {/* Arrow */}
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-copper transition-all" />

                {/* Content */}
                <div className="pt-8">
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

                {/* Bottom border animation */}
                <div className="absolute bottom-0 left-0 w-0 h-px bg-copper group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: EXPLORE */}
      <section className="py-24 md:py-32 bg-bg-secondary border-t border-border-primary">
        <div className="container-page">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-gold" />
            <h2 className="font-serif text-3xl md:text-4xl">Esplora per Categoria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Explore Fragrances */}
            <Link
              href="/explore"
              className="group relative h-64 md:h-80 overflow-hidden bg-bg-primary border border-border-primary hover:border-copper transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
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

            {/* Notes */}
            <Link
              href="/notes"
              className="group relative h-64 md:h-80 overflow-hidden bg-bg-tertiary border border-border-primary hover:border-gold transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">
                  {stats.notes.toLocaleString()}+ ingredienti
                </span>
                <h3 className="font-serif text-3xl md:text-4xl mb-4 group-hover:text-gold transition-colors">
                  Note Olfattive
                </h3>
                <div className="flex items-center gap-2 text-sm text-text-muted group-hover:text-gold transition-colors">
                  <span className="uppercase tracking-widest">Scopri</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION: CTA */}
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
