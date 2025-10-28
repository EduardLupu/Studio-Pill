"use client";

import {type CSSProperties, type SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState,} from "react";
import type {ImageMeta} from "@/lib/manifest";

type Breakpoint = "mobile" | "tablet" | "desktop";

type CardVariant = "classic" | "wide" | "tall" | "square";

type CardMetrics = {
  aspectRatio: string;
  width: string;
  maxHeight: string;
  variant: CardVariant;
};

type AccentStyle = CSSProperties & {
  ["--accent-rgb"]?: string;
  ["--card-aspect"]?: string;
  ["--tile-aspect"]?: string;
};

function resolveBreakpoint(width: number): Breakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function computeCardMetrics(
  ratio: number | undefined,
  breakpoint: Breakpoint
): CardMetrics {
  const base: CardMetrics = {
    aspectRatio:
      breakpoint === "mobile"
        ? "3 / 4"
        : breakpoint === "tablet"
        ? "4 / 3"
        : "5 / 3",
    width:
      breakpoint === "desktop"
        ? "min(100%, 1120px)"
        : breakpoint === "tablet"
        ? "min(100%, 920px)"
        : "100%",
    maxHeight:
      breakpoint === "desktop"
        ? "78vh"
        : breakpoint === "tablet"
        ? "72vh"
        : "68vh",
    variant: "classic",
  };

  if (!ratio) {
    return base;
  }

  let aspectRatio = base.aspectRatio;
  let width = base.width;
  let maxHeight = base.maxHeight;
  let variant: CardVariant = "classic";

  if (ratio >= 1.8) {
    aspectRatio = breakpoint === "mobile" ? "5 / 3" : "21 / 9";
    width = breakpoint === "desktop" ? "min(100%, 1200px)" : width;
    variant = "wide";
  } else if (ratio >= 1.4) {
    aspectRatio = breakpoint === "mobile" ? "4 / 3" : "16 / 9";
    variant = "wide";
  } else if (ratio >= 1.15) {
    aspectRatio = breakpoint === "mobile" ? "3 / 2" : "4 / 3";
    variant = "classic";
  } else if (ratio <= 0.7) {
    aspectRatio = breakpoint === "desktop" ? "2 / 3" : "3 / 4";
    width = breakpoint === "desktop" ? "min(100%, 900px)" : width;
    maxHeight = breakpoint === "desktop" ? "82vh" : maxHeight;
    variant = "tall";
  } else if (ratio <= 0.9) {
    aspectRatio = breakpoint === "desktop" ? "1 / 1" : "4 / 5";
    width = breakpoint === "desktop" ? "min(100%, 980px)" : width;
    variant = "square";
  } else {
    aspectRatio = breakpoint === "desktop" ? "4 / 3" : base.aspectRatio;
    variant = "classic";
  }

  return { aspectRatio, width, maxHeight, variant };
}

function computeTileMetrics(ratio: number | undefined): {
  aspectRatio: string;
  variant: CardVariant;
} {
  if (!ratio) {
    return { aspectRatio: "4 / 3", variant: "classic" };
  }
  if (ratio >= 1.8) {
    return { aspectRatio: "21 / 9", variant: "wide" };
  }
  if (ratio >= 1.4) {
    return { aspectRatio: "16 / 9", variant: "wide" };
  }
  if (ratio <= 0.7) {
    return { aspectRatio: "3 / 4", variant: "tall" };
  }
  if (ratio <= 0.9) {
    return { aspectRatio: "1 / 1", variant: "square" };
  }
  return { aspectRatio: "4 / 3", variant: "classic" };
}

function buildSections(items: ImageMeta[]): GallerySection[] {
  const sections: GallerySection[] = [];
  let pointer = 0;
  let heroTurn = true;

  while (pointer < items.length) {
    if (heroTurn) {
      sections.push({
        type: "hero",
        items: [{ item: items[pointer], index: pointer }],
      });
      pointer += 1;
    } else {
      const slice = items.slice(pointer, pointer + 6);
      if (!slice.length) {
        break;
      }
      sections.push({
        type: "grid",
        items: slice.map((item, offset) => ({ item, index: pointer + offset })),
      });
      pointer += slice.length;
    }
    heroTurn = !heroTurn;
  }

  return sections;
}

type SectionItem = {
  item: ImageMeta;
  index: number;
};

type GallerySection =
  | { type: "hero"; items: [SectionItem] }
  | { type: "grid"; items: SectionItem[] };

type ScrollGalleryProps = {
  items: ImageMeta[];
};

export function ScrollGallery({ items }: ScrollGalleryProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [ratios, setRatios] = useState<Map<number, number>>(new Map());

  const preparedItems = useMemo(() => items.slice(0, 24), [items]);
  const sections = useMemo(() => buildSections(preparedItems), [preparedItems]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const update = () => {
      setBreakpoint(resolveBreakpoint(window.innerWidth));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!preparedItems.length) {
    return (
      <div className="rounded-[2rem] border border-white/70 bg-white/70 px-6 py-20 text-center text-sm text-ink/60 backdrop-blur">
        gallery warming up. refresh shortly.
      </div>
    );
  }

  useEffect(() => {
    setRatios((prev) => {
      if (prev.size === 0) {
        return prev;
      }
      const next = new Map<number, number>();
      preparedItems.forEach((_, index) => {
        const value = prev.get(index);
        if (typeof value === "number") {
          next.set(index, value);
        }
      });
      return next;
    });
  }, [preparedItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(
      container.querySelectorAll<HTMLElement>("[data-scroll-card]")
    );
    if (!cards.length) return;

    const visibilityMap = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(
            (entry.target as HTMLElement).dataset.scrollIndex ?? -1
          );
          if (index >= 0) {
            visibilityMap.set(index, entry.intersectionRatio);
          }
        });
        const best = [...visibilityMap.entries()].sort((a, b) => b[1] - a[1]);
        if (best.length) {
          const [index] = best[0];
          setActiveIndex((prev) => (prev === index ? prev : index));
        }
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-25% 0px -25% 0px",
      }
    );

    cards.forEach((card, index) => {
      card.dataset.scrollIndex = index.toString();
      observer.observe(card);
    });

    return () => {
      cards.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, [preparedItems.length]);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= preparedItems.length) {
      setSelectedIndex(null);
    }
  }, [preparedItems.length, selectedIndex]);

  const selectedItem =
    selectedIndex !== null ? preparedItems[selectedIndex] ?? null : null;

  const accents = useMemo(
    () => [
      "232, 236, 255",
      "250, 235, 229",
      "225, 243, 235",
      "241, 233, 253",
      "232, 244, 253",
      "248, 240, 232",
    ],
    []
  );

  const handleImageLoad = useCallback(
    (index: number) => (event: SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight } = event.currentTarget;
      if (!naturalWidth || !naturalHeight) {
        return;
      }
      const ratio = naturalWidth / naturalHeight;
      setRatios((prev) => {
        const current = prev.get(index);
        if (current && Math.abs(current - ratio) < 0.01) {
          return prev;
        }
        const next = new Map(prev);
        next.set(index, ratio);
        return next;
      });
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="scroll-stack"
    >
      {sections.map((section) => {
        if (section.type === "hero") {
          const hero = section.items[0];
          const ratio = ratios.get(hero.index);
          const metrics = computeCardMetrics(ratio, breakpoint);
          const accent = accents[hero.index % accents.length];
          const isActive = activeIndex === hero.index;
          const cardStyle: AccentStyle = {
            width: metrics.width,
            maxHeight: metrics.maxHeight,
            "--accent-rgb": accent,
            "--card-aspect": metrics.aspectRatio,
          };

          return (
            <section
              key={`hero-${hero.index}`}
              className="scroll-section scroll-section--hero"
            >
              <button
                type="button"
                className="scroll-card-trigger focus-ring"
                onClick={() => setSelectedIndex(hero.index)}
                aria-label={hero.item.alt ?? "open render"}
              >
                <div
                  data-scroll-card
                  className="scroll-card"
                  data-active={isActive ? "true" : undefined}
                  data-variant={metrics.variant}
                  style={cardStyle}
                >
                  <div className="scroll-card__media">
                    <img
                      src={hero.item.src}
                      alt={hero.item.alt ?? ""}
                      loading="lazy"
                      decoding="async"
                      width={2000}
                      height={1400}
                      className="scroll-card__image"
                      onLoad={handleImageLoad(hero.index)}
                    />
                  </div>
                  <div className="scroll-card__veil" aria-hidden="true" />
                  <div className="scroll-card__label">
                    <span>studio pill</span>
                    <span>{hero.index + 1}</span>
                  </div>
                </div>
              </button>
            </section>
          );
        }

        return (
          <section
            key={`grid-${section.items[0]?.index ?? 0}`}
            className="scroll-section scroll-section--grid"
          >
            <div className="scroll-grid">
              {section.items.map(({ item, index }) => {
                const ratio = ratios.get(index);
                const tile = computeTileMetrics(ratio);
                const accent = accents[index % accents.length];
                const tileStyle: AccentStyle = {
                  "--accent-rgb": accent,
                  "--tile-aspect": tile.aspectRatio,
                };
                return (
                  <button
                    key={item.src}
                    type="button"
                    className="scroll-grid__item focus-ring"
                    data-scroll-card
                    data-variant={tile.variant}
                    style={tileStyle}
                    onClick={() => setSelectedIndex(index)}
                    aria-label={item.alt ?? "open render"}
                  >
                    <div className="scroll-grid__media">
                      <img
                        src={item.src}
                        alt={item.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        width={1600}
                        height={1200}
                        className="scroll-grid__image"
                        onLoad={handleImageLoad(index)}
                      />
                    </div>
                    <div className="scroll-grid__label">
                      <span>studio pill</span>
                      <span>{index + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
      {selectedItem && selectedIndex !== null ? (
        <Lightbox
          item={selectedItem}
          index={selectedIndex}
          count={preparedItems.length}
          onClose={() => setSelectedIndex(null)}
          onNavigate={(direction) => {
            setSelectedIndex((prev) => {
              if (prev === null) return prev;
                return (prev + direction + preparedItems.length) %
                  preparedItems.length;
            });
          }}
        />
      ) : null}
    </div>
  );
}

type LightboxProps = {
  item: ImageMeta;
  index: number;
  count: number;
  onClose: () => void;
  onNavigate: (direction: number) => void;
};

function Lightbox({ item, index, count, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        onNavigate(1);
      }
      if (event.key === "ArrowLeft") {
        onNavigate(-1);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNavigate]);

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="expanded render"
    >
      <div
        className="lightbox-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          className="lightbox-image"
        />
        <div className="lightbox-meta">
          <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
          <span>/</span>
          <span>{count < 10 ? `0${count}` : count}</span>
          {item.title ? (
            <>
              <span>-</span>
              <span>{item.title}</span>
            </>
          ) : null}
        </div>
        <button
          type="button"
          className="lightbox-close focus-ring"
          onClick={onClose}
          aria-label="close image"
        >
          close
        </button>
        <div className="lightbox-controls">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="focus-ring"
            aria-label="previous image"
          >
            {
              "<"
            }
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="focus-ring"
            aria-label="next image"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
