"use client";

import { type SyntheticEvent, useMemo, useState } from "react";
import Image from "next/image";
import constants from "@/data/constants.json";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
};

const captionEnMap = constants.homeGallery.captionEnMap as Record<string, string>;

export function HomePreviewGallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, items.length - 1);
  const current = useMemo(() => items[index] ?? items[0], [items, index]);

  const onImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === "1") return;
    img.dataset.fallbackApplied = "1";
    img.src = "/images/gallery-3.jpg";
  };

  if (!items?.length || !current) return null;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">校区风貌</h2>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 sm:hidden">
          {items.map((item) => (
            <figure key={`mobile-${item.id}`} className="relative aspect-video w-[92%] shrink-0 snap-start overflow-hidden rounded-2xl">
              <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" sizes="92vw" onError={onImgError} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deepSpace/90 via-deepSpace/35 to-transparent p-4">
                <p className="text-base font-semibold text-white">{item.caption}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{captionEnMap[item.id] ?? item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="relative hidden aspect-video w-full sm:block">
          <Image
            src={current.imageUrl}
            alt={current.caption}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            onError={onImgError}
          />

          <button
            type="button"
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            disabled={index === 0}
            className="absolute left-4 top-1/2 z-10 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-deepSpace/60 text-3xl text-white transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="查看上一张图片"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
            disabled={index >= maxIndex}
            className="absolute right-4 top-1/2 z-10 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-deepSpace/60 text-3xl text-white transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="查看下一张图片"
          >
            ›
          </button>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deepSpace/90 via-deepSpace/35 to-transparent p-5 sm:p-6">
            <p className="text-lg font-semibold text-white sm:text-xl">{current.caption}</p>
            <p className="mt-1 text-base font-semibold text-accent sm:text-lg">{captionEnMap[current.id] ?? current.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
