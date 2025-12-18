import Link from "next/link";

export default function FragranceNotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center pt-24 pb-16">
            <div className="container-page text-center">
                <span className="text-6xl">🌸</span>
                <h1 className="mt-6 text-2xl font-bold text-text-primary">
                    Fragranza non trovata
                </h1>
                <p className="mt-2 text-text-muted">
                    La fragranza che stai cercando non esiste nel nostro database.
                </p>
                <Link
                    href="/explore"
                    className="mt-6 inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                    Esplora fragranze
                </Link>
            </div>
        </main>
    );
}
