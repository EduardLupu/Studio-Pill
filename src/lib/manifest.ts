"use client";

import { useEffect, useState } from "react";

export type ImageMeta = {
  src: string;
  title?: string;
  year?: string;
  medium?: string;
  location?: string;
  caption?: string;
  alt?: string;
};

type ManifestState =
  | { status: "idle"; items: ImageMeta[] }
  | { status: "loading"; items: ImageMeta[] }
  | { status: "ready"; items: ImageMeta[] }
  | { status: "error"; items: ImageMeta[]; error: Error };

const manifestCache = new Map<string, ImageMeta[]>();

function deriveAlt(meta: ImageMeta): string {
  if (meta.alt) {
    return meta.alt;
  }
  if (meta.title) {
    return meta.title.toLowerCase();
  }
  const fileName = meta.src.split("/").pop() ?? "";
  const raw = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
  return raw.trim().toLowerCase();
}

export function useImageManifest(manifestPath: string) {
  const [state, setState] = useState<ManifestState>(() => {
    const cached = manifestCache.get(manifestPath);
    if (cached) {
      return { status: "ready", items: cached };
    }
    return { status: "idle", items: [] };
  });

  useEffect(() => {
    let cancelled = false;

    async function loadManifest() {
      if (manifestCache.has(manifestPath)) {
        return;
      }
      setState({ status: "loading", items: [] });
      try {
        const response = await fetch(manifestPath, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`failed to load manifest: ${response.status}`);
        }
        const data = (await response.json()) as Array<ImageMeta | string>;
        const processed = data.map((entry) => {
          const item =
            typeof entry === "string"
              ? ({
                  src: entry,
                } as ImageMeta)
              : entry;
          return {
            ...item,
            alt: deriveAlt(item),
          };
        });
        manifestCache.set(manifestPath, processed);
        if (!cancelled) {
          setState({ status: "ready", items: processed });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            items: [],
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    }

    loadManifest();

    return () => {
      cancelled = true;
    };
  }, [manifestPath]);

  return state;
}
