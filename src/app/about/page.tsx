"use client";

import Link from "next/link";
import Script from "next/script";
import { useImageManifest } from "@/lib/manifest";
import { FloatingGallery } from "@/components/floating-gallery";
import { useMemo } from "react";

export default function AboutPage(): JSX.Element {
  const artworks = useImageManifest("/data/about.json");
  const loading = artworks.status === "idle" || artworks.status === "loading";
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "pilu",
      url: "https://studiopill.com/about",
      jobTitle: "cg artist",
      worksFor: {
        "@type": "Organization",
        name: "studio pill",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "cluj-napoca",
        addressCountry: "RO",
      },
      sameAs: [
        "https://www.instagram.com/studio.pill",
        "https://www.behance.net/saneart",
      ],
    }),
    []
  );

  return (
    <div className="flex flex-col gap-24 pb-24">
      <Script
        id="ld-about-person"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>
      <AboutHero />

      <section className="grid gap-10 px-4 sm:px-6 lg:grid-cols-[320px,1fr] lg:gap-16 lg:px-8">
        <div className="flex flex-col gap-6 text-xs text-ink/45">
          <span>studio pill</span>
          <span>cg visualization</span>
          <span>architecture student, technical university</span>
          <span>cluj-napoca, romania</span>
          <div className="h-px w-full bg-ink/10" />
          <Link
            href="mailto:hello@studiopill.com"
            className="focus-ring inline-flex w-fit items-center gap-2 border border-ink/15 px-4 py-2 text-ink/60 transition-all duration-250 ease-soft-ease hover:-translate-y-1 hover:border-ink/25 hover:text-ink"
          >
            email the studio
          </Link>
          <div className="flex flex-col gap-2">
            <span>instagram - studio.pill</span>
            <span>behance - saneart</span>
          </div>
        </div>
        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink/60">
          <p>
            studio pill is pilu's space for crafting cg atmospheres that feel
            honest and calm. training in architecture shapes every render, from
            structural rhythm to the smallest tactile decision.
          </p>
          <p>
            each project begins with sound and light, building up soft
            narratives where materials are slow and shadows hold a story. the
            work is anti-noise - quiet camera moves, restrained palettes, and
            minimal text. the gallery is meant to be felt more than read.
          </p>
          <p>
            commissions span residential interiors, experimental exteriors, and
            visual essays for product and spatial brands. the approach is
            collaborative, iterative, and detail-obsessed.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3">
          <span className="text-xs text-ink/40">practice pillars</span>
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="border border-ink/10 bg-white/90 p-6 text-sm text-ink/60 shadow-[0_20px_80px_-70px_rgba(11,11,11,0.45)] transition-transform duration-500 ease-soft-ease hover:-translate-y-1"
              >
                <span className="text-xs text-ink/40">{pillar.title}</span>
                <p className="mt-4 text-sm text-ink/60">{pillar.body}</p>
              </div>
            ))}
          </div>
        </header>
      </section>

      <section className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-xs text-ink/45">
          <span>sketchbook fragments</span>
          <span>no order - just pulse</span>
        </div>
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-fog/80 pb-[75%]"
              />
            ))}
          </div>
        )}
        {artworks.status === "ready" && artworks.items.length > 0 ? (
          <FloatingGallery items={artworks.items} columns={2} />
        ) : null}
        {artworks.status === "error" ? (
          <p className="text-sm text-ink/40">
            artworks are temporarily offline. check again soon.
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-3xl border border-ink/10 bg-white/90 px-6 py-10 text-sm text-ink/55 shadow-[0_20px_120px_-90px_rgba(11,11,11,0.45)] sm:px-10">
        <p>
          available for collaborations, residency visuals, and architectural
          competitions. drop references, playlists, and moodboards - let's craft a
          slow experience together.
        </p>
      </section>
    </div>
  );
}

const pillars = [
  {
    title: "light choreography",
    body: "layered lighting that feels cinematic but plausible. subtle bloom, dusk gradients, soft occlusion.",
  },
  {
    title: "material intimacy",
    body: "micro-surface storytelling - dusty stone, imperfect plaster, brushed metals that catch the eye only once.",
  },
  {
    title: "emotive pacing",
    body: "frames sequenced as breathing exercises. minimal camera shifts, generous whitespace, stillness first.",
  },
];

function AboutHero() {
  return (
    <section className="relative flex flex-col gap-10 px-4 pt-16 sm:px-6 lg:flex-row lg:items-end lg:gap-16 lg:px-8">
      <div className="relative w-full max-w-md overflow-hidden bg-fog/90 shadow-[0_40px_120px_-100px_rgba(11,11,11,0.6)]">
        <img
          src="/about/pilu.png"
          alt="studio pill portrait"
          loading="lazy"
          decoding="async"
          width={640}
          height={800}
          className="h-full w-full object-cover transition-transform duration-1000 ease-soft-ease hover:scale-[1.03]"
        />
      </div>
      <div className="flex max-w-2xl flex-col gap-6 text-sm text-ink/55">
        <span className="text-xs text-ink/40">about</span>
        <h1 className="text-sm text-ink/70">
          șerban vacariu (also knows as pilu) designs cg universes for calm spaces.
        </h1>
        <p>
          blending architectural thinking with digital artistry, the practice
          focuses on atmosphere-first visuals. everything stays lowercase to
          keep attention on the imagery.
        </p>
        <p>
          scroll the home page for the living portfolio, or write with project
          ideas, unconventional briefs, and collaborative experiments.
        </p>
      </div>
    </section>
  );
}
