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
    <section className="mx-auto w-full max-w-none px-0">
      <div className="relative h-auto overflow-hidden bg-white/[0.04] sm:rounded-none lg:h-screen">
        <div className="-mx-1 flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto px-1 lg:hidden">
          {items.map((item) => (
            <figure key={`mobile-${item.id}`} className="relative aspect-[16/10] w-[94%] shrink-0 snap-start overflow-hidden rounded-2xl">
              <Image src={item.imageUrl} alt={item.caption} fill className="scale-[1.03] object-cover object-center" sizes="94vw" onError={onImgError} />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020712]/75 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/45 p-4 text-center">
                <p className="text-base font-semibold text-white">{item.caption}</p>
                <p className="mt-1 text-sm font-semibold text-accent">{captionEnMap[item.id] ?? item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="relative hidden h-full w-full lg:block">
          <Image
            src={current.imageUrl}
            alt={current.caption}
            fill
            className="scale-[1.06] object-cover object-center"
            sizes="100vw"
            onError={onImgError}
          />
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#020712]/82 via-[#071225]/45 to-transparent" />

          <button
            type="button"
            onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
            disabled={index === 0}
            className="absolute left-6 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-deepSpace/55 text-3xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="查看上一张图片"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
            disabled={index >= maxIndex}
            className="absolute right-6 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-deepSpace/55 text-3xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="查看下一张图片"
          >
            ›
          </button>

          <div className="absolute inset-x-0 bottom-0 z-20 bg-black/45 p-6 text-center sm:p-8">
            <p className="text-2xl font-semibold text-white sm:text-3xl">{current.caption}</p>
            <p className="mt-2 text-lg font-semibold text-accent sm:text-2xl">{captionEnMap[current.id] ?? current.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
