import Link from "next/link";
import { getFeaturedFragrances } from "@/lib/fragrance-service";
import { FragranceCard } from "@/components/fragrance/fragrance-card";
import { ArrowRight, Search, Star, TrendingUp, Sparkles } from "lucide-react";

/**
 * Homepage - Sillage
 * Modern, minimal design with proper hierarchy and spacing
 */
export default async function HomePage() {
  const featuredFragrances = await getFeaturedFragrances(6);

  return (
    <div className="flex flex-col">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />

        <div className="container-page relative">
          <div className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
            {/* Eyebrow */}
            <div className="mb-8 flex items-center gap-3 rounded-full border border-border-primary bg-bg-secondary px-5 py-2.5">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              <span className="text-sm font-medium text-text-secondary">
                Il database italiano delle fragranze
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Scopri il mondo delle{" "}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-accent via-accent-secondary to-accent-tertiary bg-clip-text text-transparent">
                  fragranze
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
              Esplora oltre 24.000 profumi, leggi recensioni dalla community
              e trova la tua firma olfattiva perfetta.
            </p>

            {/* CTA Group */}
            <div className="mt-12 flex w-full max-w-md flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/explore"
                className="group flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-accent px-8 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/30"
              >
                <Search className="h-5 w-5" />
                Esplora fragranze
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-bg-primary bg-bg-tertiary text-xs font-medium"
                    >
                      {["A", "M", "G", "S"][i - 1]}
                    </div>
                  ))}
                </div>
                <span>50k+ utenti attivi</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                <span>100k+ recensioni</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED FRAGRANCES
          ============================================ */}
      <section className="border-t border-border-primary py-24">
        <div className="container-page">
          {/* Section Header */}
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-widest">
                  In evidenza
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl">
                Fragranze del momento
              </h2>
              <p className="mt-3 max-w-lg text-text-secondary">
                Le fragranze più amate dalla nostra community questa settimana.
              </p>
            </div>
            <Link
              href="/explore"
              className="group flex items-center gap-2 rounded-full border border-border-primary px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent hover:text-accent"
            >
              Vedi tutte
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Fragrances Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFragrances.map((fragrance) => (
              <FragranceCard key={fragrance.id} fragrance={fragrance} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORIES
          ============================================ */}
      <section className="bg-bg-secondary py-24">
        <div className="container-page">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Categorie
              </span>
            </div>
            <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl">
              Esplora per stile
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Trova fragranze che si adattano al tuo gusto personale.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Maschili",
                href: "/explore?gender=masculine",
                emoji: "🧔",
                count: "8.5k",
                color: "from-blue-500/10 to-indigo-500/10",
              },
              {
                label: "Femminili",
                href: "/explore?gender=feminine",
                emoji: "👩",
                count: "10.2k",
                color: "from-pink-500/10 to-rose-500/10",
              },
              {
                label: "Unisex",
                href: "/explore?gender=unisex",
                emoji: "✨",
                count: "5.3k",
                color: "from-violet-500/10 to-purple-500/10",
              },
              {
                label: "Niche",
                href: "/explore?type=niche",
                emoji: "💎",
                count: "3.1k",
                color: "from-amber-500/10 to-orange-500/10",
              },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-border-primary bg-bg-primary p-6 transition-all hover:border-accent hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <span className="text-4xl">{cat.emoji}</span>
                  <h3 className="mt-4 text-xl font-semibold text-text-primary">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">
                    {cat.count} fragranze
                  </p>
                </div>
                <ArrowRight className="absolute bottom-6 right-6 h-5 w-5 text-text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          {/* Accords Pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { label: "Legnosi", emoji: "🪵" },
              { label: "Freschi", emoji: "🌊" },
              { label: "Orientali", emoji: "🌙" },
              { label: "Floreali", emoji: "🌸" },
              { label: "Agrumati", emoji: "🍋" },
              { label: "Speziati", emoji: "🌶️" },
            ].map((accord) => (
              <Link
                key={accord.label}
                href={`/explore?accord=${accord.label.toLowerCase()}`}
                className="flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-accent hover:text-accent"
              >
                <span>{accord.emoji}</span>
                {accord.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          BRANDS
          ============================================ */}
      <section className="border-t border-border-primary py-24">
        <div className="container-page">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Brand
            </span>
            <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl">
              I marchi più amati
            </h2>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Chanel",
              "Dior",
              "Tom Ford",
              "Creed",
              "Armani",
              "YSL",
            ].map((brand) => (
              <Link
                key={brand}
                href={`/explore?brand=${brand.toLowerCase().replace(" ", "-")}`}
                className="flex h-28 items-center justify-center rounded-2xl border border-border-primary bg-bg-secondary text-lg font-semibold text-text-secondary transition-all hover:border-accent hover:bg-bg-primary hover:text-text-primary"
              >
                {brand}
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-accent"
            >
              Vedi tutti i 500+ brand
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CTA
          ============================================ */}
      <section className="bg-gradient-to-br from-accent/10 via-accent-secondary/5 to-transparent py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Pronto a iniziare?
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Unisciti a oltre 50.000 appassionati di fragranze.
              È completamente gratuito.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="flex h-14 items-center justify-center rounded-2xl bg-accent px-10 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
              >
                Crea account gratuito
              </Link>
              <Link
                href="/explore"
                className="flex h-14 items-center justify-center rounded-2xl border border-border-secondary bg-bg-secondary px-10 text-base font-semibold text-text-primary transition-all hover:border-accent hover:bg-bg-primary"
              >
                Esplora senza account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
