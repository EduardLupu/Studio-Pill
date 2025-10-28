"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ImageMeta } from "@/lib/manifest";

type FloatingGalleryProps = {
  items: ImageMeta[];
  columns?: number;
};

export function FloatingGallery({
  items,
  columns = 3,
}: FloatingGalleryProps): JSX.Element {
  const slices = useMemo(() => {
    if (!items.length) return Array.from({ length: columns }, () => []);
    const buckets: ImageMeta[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      buckets[index % columns].push(item);
    });
    return buckets;
  }, [columns, items]);

  const gridClasses = ["grid", "grid-cols-1", "gap-6"];
  if (columns >= 2) {
    gridClasses.push("md:grid-cols-2");
  }
  if (columns >= 3) {
    gridClasses.push("xl:grid-cols-3");
  }
  if (columns >= 4) {
    gridClasses.push("2xl:grid-cols-4");
  }

  return (
    <div className={gridClasses.join(" ")}>
      {slices.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={[
            "flex flex-col gap-6",
            columns >= 2 && columnIndex === 1
              ? "md:translate-y-12"
              : "",
            columns >= 3 && columnIndex === 2
              ? "xl:translate-y-20"
              : "",
            columns >= 4 && columnIndex === 3
              ? "2xl:translate-y-28"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {column.map((item, localIndex) => (
            <RevealImage
              key={item.src + localIndex}
              item={item}
              delay={localIndex * 70 + columnIndex * 60}
              accent={columnIndex % 2 === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function RevealImage({
  item,
  delay,
  accent,
}: {
  item: ImageMeta;
  delay: number;
  accent: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "relative overflow-hidden bg-fog/60 shadow-[0_30px_80px_-60px_rgba(11,11,11,0.4)] transition-all duration-700 ease-soft-ease",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        accent ? "hover:shadow-[0_40px_120px_-70px_rgba(11,11,11,0.55)]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img
        src={item.src}
        alt={item.alt ?? ""}
        loading="lazy"
        decoding="async"
        width={1600}
        height={1200}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
