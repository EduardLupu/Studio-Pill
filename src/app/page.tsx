"use client";

import Link from "next/link";
import Script from "next/script";
import { useMemo } from "react";
import { ScrollGallery } from "@/components/scroll-gallery";
import { FloatingGallery } from "@/components/floating-gallery";
import { useImageManifest } from "@/lib/manifest";

export default function HomePage(): JSX.Element {
    const renders = useImageManifest("/data/renders.json");
    const personal = useImageManifest("/data/about.json");
    const readyRenders = renders.status === "ready" ? renders.items : [];
    const readyPersonal = personal.status === "ready" ? personal.items : [];
    const capsuleGallery = useMemo(() => {
        const curatedRenders1 = readyRenders.slice(0, 3);
        const curatedPersonal1 = readyPersonal.slice(0, 3);
        const curatedRenders2 = readyRenders.slice(3, 6);
        const curatedPersonal2 = readyPersonal.slice(3, 6);
        const curatedRenders3 = readyRenders.slice(6, 9);
        const curatedPersonal3 = readyPersonal.slice(6, 10);
        const curatedRenders4 = readyRenders.slice(9, 12);
        return [...curatedRenders1, ...curatedPersonal1, ...curatedRenders2, ...curatedPersonal2, ...curatedRenders3, ...curatedPersonal3, ...curatedRenders4];
    }, [readyPersonal, readyRenders]);

    const galleryStructuredData = useMemo(() => {
        if (!readyRenders.length) {
            return null;
        }
        return {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "studio pill renders gallery",
            description:
                "curated cg visualizations and personal artworks from studio pill.",
            url: "https://studiopill.com/",
            hasPart: readyRenders.map((item, index) => ({
                "@type": "ImageObject",
                position: index + 1,
                url: item.src.startsWith("http") ? item.src : `https://studiopill.com${item.src}`,
                name: item.title ?? item.alt ?? `render ${index + 1}`,
                caption: item.title ?? undefined,
            })),
        };
    }, [readyRenders]);

    const rendersLoading =
        renders.status === "idle" || renders.status === "loading";
    const personalLoading =
        personal.status === "idle" || personal.status === "loading";

    return (
        <div className="flex flex-col gap-32 pb-24">
            {galleryStructuredData ? (
                <Script
                    id="ld-home-gallery"
                    type="application/ld+json"
                    strategy="afterInteractive"
                >
                    {JSON.stringify(galleryStructuredData)}
                </Script>
            ) : null}
            <Hero/>

            <section className="flex flex-col gap-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between text-xs text-ink/60">
                    <span>scroll to reveal each render</span>
                    <span>slow pace recommended</span>
                </div>
                {rendersLoading && (
                    <div className="h-[70vh] animate-pulse rounded-[2.6rem] bg-fog/80"/>
                )}
            </section>

            {readyRenders.length > 0 ? <ScrollGallery items={readyRenders}/> : null}

            {renders.status === "error" ? (
                <p className="px-4 text-sm text-ink/40 sm:px-6 lg:px-8">
                    gallery is resting right now. refresh soon.
                </p>
            ) : null}

            <section className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 text-sm text-ink/70 sm:max-w-xl">
                    <p>
                        the sequence above is the primary experience - quiet frames revealed
                        at your own rhythm. below lives a condensed archive for drifting and
                        revisiting.
                    </p>
                </div>
            </section>

            <section className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-3">
                    <span className="text-xs text-ink/40">capsule gallery</span>
                    <h2 className="max-w-xl text-sm text-ink/75">
                        a softer grid that collects recent renders and personal studies.
                        wander freely.
                    </h2>
                </header>
                {(rendersLoading || personalLoading) && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({length: 6}).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-[1.8rem] bg-fog/80 pb-[75%]"
                            />
                        ))}
                    </div>
                )}
                {capsuleGallery.length > 0 ? (
                    <FloatingGallery items={capsuleGallery} columns={3}/>
                ) : null}
                {personal.status === "error" ? (
                    <p className="text-sm text-ink/40">the archive is resting right now.</p>
                ) : null}
            </section>

            <ContactBlock/>
        </div>
    );
}

function Hero() {
    return (
        <section className="relative flex min-h-[92vh] flex-col justify-between px-4 pb-10 pt-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/60 to-white"/>

            <div className="flex items-center justify-between text-xs text-ink/55">
                <span>studio pill - visual storytelling</span>
                <span>cluj-napoca - romania</span>
            </div>

            <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex max-w-3xl flex-col gap-10 text-ink/75">
                    <div className="flex items-center gap-6">
            <span
                className="relative inline-flex h-24 w-24 items-center justify-center rounded-[1.6rem] bg-white/70 shadow-[0_20px_90px_-60px_rgba(11,11,11,0.6)] backdrop-blur">
              <img
                  src="/pillv3.png"
                  alt="studio pill logo"
                  className="h-16 w-16 object-contain transition-transform duration-700 ease-soft-long hover:scale-[1.05]"
                  loading="lazy"
                  decoding="async"
                  width={128}
                  height={128}
              />
            </span>
                        <div className="flex flex-col gap-2 text-xs text-ink/60">
                            <span>cg artist</span>
                            <span>3d visualization</span>
                            <span>visual atmospheres</span>
                        </div>
                    </div>

                    <h1 className="text-[clamp(2.8rem,6vw+1.4rem,6.1rem)] font-semibold leading-[0.9] tracking-[-0.018em] text-ink">
                        luminous cg environments choreographed for stillness and awe.
                    </h1>

                    <div className="grid gap-4 text-sm text-ink/70 sm:max-w-xl">
                        <p>
                            this portfolio is a single cinematic scroll. every render drifts
                            into view with depth, glow, and micro-motion. keep the pace slow.
                        </p>
                        <p>
                            no captions. no distractions. just the image and the emotion it
                            carries.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-5 text-xs text-ink/60">
                    <Link
                        href="/about"
                        className="group focus-ring inline-flex items-center gap-3 rounded-full border border-ink/10 px-6 py-3 text-ink transition-all duration-300 ease-soft-ease hover:-translate-y-1 hover:border-ink/30 hover:bg-fog/70"
                        prefetch
                    >
                        <span>about</span>
                        <span
                            className="h-[1px] w-6 bg-ink/30 transition-all duration-300 ease-soft-ease group-hover:w-9"/>
                    </Link>
                    <div className="flex items-center gap-2 text-[0.7rem] tracking-[0.35em] text-ink/35">
                        <span>scroll</span>
                        <span className="h-px w-10 bg-ink/20"/>
                        <span>down</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactBlock() {
    return (
        <section
            className="mx-auto flex max-w-4xl flex-col gap-6 rounded-[2.4rem] border border-white/70 bg-gradient-to-br from-white/88 via-white/74 to-white/62 px-6 py-12 text-sm text-ink/70 shadow-[0_40px_160px_-100px_rgba(11,11,11,0.55)] backdrop-blur-xl sm:px-12">
            <p className="max-w-2xl text-ink/75">
                collaborations, briefs, and moodboards land at{" "}
                <Link
                    href="mailto:hello@studiopill.com"
                    className="relative underline decoration-ink/30 underline-offset-4 transition-colors duration-300 ease-soft-ease hover:decoration-ink"
                >
                    hello@studiopill.com
                </Link>
                .
            </p>
            <p className="text-xs text-ink/55">
                slow visuals for thoughtful spaces. respond when ready.
            </p>
        </section>
    );
}
