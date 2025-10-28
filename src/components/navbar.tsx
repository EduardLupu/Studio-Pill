"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
];

export function Navbar(): JSX.Element {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 6);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-30 border-b border-transparent bg-white/80 backdrop-blur-sm transition-all duration-250 ease-soft-ease",
        isScrolled ? "border-ink/10 shadow-[0_2px_14px_-12px_rgba(11,11,11,0.4)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="site navigation"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-ring inline-flex items-center gap-3 text-sm text-ink/70 transition-transform duration-250 ease-soft-ease hover:-translate-y-0.5"
        >
          <img
            src="/pillv3.png"
            alt="studio pill logo"
            className="h-8 w-8 object-contain"
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
          />
          <span>studio pill</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          {links.map(({ href, label }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "focus-ring text-sm lowercase tracking-[0.12em] text-ink/60 transition-all duration-250 ease-soft-ease hover:text-ink hover:opacity-80",
                  active ? "text-ink" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={active ? "page" : undefined}
                prefetch
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  <span
                    className={[
                      "ml-1 h-[2px] w-2 bg-ink transition-opacity duration-250 ease-soft-ease",
                      active ? "opacity-60" : "opacity-0",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
