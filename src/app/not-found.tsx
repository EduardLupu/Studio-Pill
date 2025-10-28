
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-semibold text-ink/80 tracking-tighter">404</h1>
      <p className="mt-4 text-lg text-ink/60">page not found.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-3 border border-ink/10 px-6 py-3 text-sm text-ink transition-all duration-300 ease-soft-ease hover:-translate-y-1 hover:border-ink/30 hover:bg-fog/70 focus-ring"
      >
        <span>return home</span>
      </Link>
    </div>
  );
}
