import Link from "next/link";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-ink/5 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-ink/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>copyright studio pill - cluj-napoca, romania</span>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="https://instagram.com/studio.pill"
            target="_blank"
            rel="noreferrer"
            className="focus-ring transition-transform duration-250 ease-soft-ease hover:-translate-y-0.5 hover:text-ink"
          >
            instagram
          </Link>
          <Link
            href="https://www.behance.net/saneart"
            target="_blank"
            rel="noreferrer"
            className="focus-ring transition-transform duration-250 ease-soft-ease hover:-translate-y-0.5 hover:text-ink"
          >
            behance
          </Link>
          <Link
            href="mailto:hello@studiopill.com"
            className="focus-ring transition-transform duration-250 ease-soft-ease hover:-translate-y-0.5 hover:text-ink"
          >
            hello@studiopill.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
