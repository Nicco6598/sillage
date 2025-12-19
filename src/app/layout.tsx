import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sillage - Scopri le Migliori Fragranze",
    template: "%s | Sillage",
  },
  description:
    "Esplora migliaia di fragranze, leggi recensioni autentiche e trova il tuo profumo perfetto con la community più grande d'Italia.",
  keywords: [
    "profumi",
    "fragranze",
    "recensioni profumi",
    "Chanel",
    "Dior",
    "Tom Ford",
    "fragranze maschili",
    "fragranze femminili",
    "note olfattive",
  ],
  authors: [{ name: "Sillage" }],
  creator: "Sillage",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://sillage.app",
    siteName: "Sillage",
    title: "Sillage - Scopri le Migliori Fragranze",
    description:
      "Esplora migliaia di fragranze, leggi recensioni autentiche e trova il tuo profumo perfetto.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sillage - Scopri le Migliori Fragranze",
    description:
      "Esplora migliaia di fragranze, leggi recensioni autentiche e trova il tuo profumo perfetto.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('sillage-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} min-h-screen bg-bg-primary font-sans text-text-primary antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
