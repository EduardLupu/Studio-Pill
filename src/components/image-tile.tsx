"use client";

import { forwardRef } from "react";
import type { ImageMeta } from "@/lib/manifest";
import Link from "next/link";

type ImageTileProps = {
  item: ImageMeta;
  href?: string;
  overlay?: React.ReactNode;
  aspectRatio?: string;
} & React.ComponentPropsWithoutRef<"div">;

export const ImageTile = forwardRef<HTMLDivElement, ImageTileProps>(
  ({ item, href, overlay, aspectRatio = "aspect-[4/3]", className = "", ...props }, ref) => {
    const content = (
      <div
        className={[
          "group relative overflow-hidden rounded-[1.6rem] bg-fog/80",
          aspectRatio,
          "transition-transform duration-250 ease-soft-ease hover:scale-[1.01]",
          "focus-ring",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        ref={ref}
        {...props}
      >
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          width={1600}
          height={1200}
          className="h-full w-full object-cover transition-opacity duration-500 ease-soft-ease group-hover:opacity-95"
        />
        {overlay ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-white/80 via-white/0 to-transparent p-4 text-[0.7rem] text-ink/70 opacity-0 transition-opacity duration-250 ease-soft-ease group-hover:opacity-80">
            {overlay}
          </div>
        ) : null}
      </div>
    );

    if (href) {
      return (
        <Link
          href={href}
          className="block"
          prefetch
          aria-label={`${item.alt ?? "view image"} - open gallery`}
        >
          {content}
        </Link>
      );
    }

    return content;
  }
);

ImageTile.displayName = "ImageTile";
