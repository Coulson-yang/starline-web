"use client";

import Image from "next/image";
import constants from "@/data/constants.json";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
};

const captionEnMap = constants.homeGallery.captionEnMap as Record<string, string>;

export function HomePreviewGallery({ items }: { items: GalleryItem[] }) {
  if (!items?.length) return null;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">校区风貌</h2>
      </div>

      <div className="relative mt-5">
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {items.map((item) => (
            <figure key={item.id} className="w-[92%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] sm:w-auto sm:shrink sm:snap-none">
              <div className="relative aspect-video w-full">
                <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 33vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deepSpace/90 via-deepSpace/35 to-transparent p-4 sm:p-5">
                  <p className="text-base font-semibold text-white sm:text-lg">{item.caption}</p>
                  <p className="mt-1 text-sm font-semibold text-accent sm:text-base">{captionEnMap[item.id] ?? item.caption}</p>
                </div>
              </div>
            </figure>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-deepSpace/90 to-transparent sm:hidden" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-deepSpace/90 to-transparent sm:hidden" />
      </div>
      <p className="mt-3 text-center text-[11px] text-white/45 sm:hidden">左右滑动切换图片</p>
    </section>
  );
}
