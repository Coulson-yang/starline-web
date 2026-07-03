"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  imageUrl: string;
  caption: string;
};

type GalleryCategory = "all" | "campus" | "classroom" | "materials" | "events";

type GalleryItemView = GalleryItem & {
  category: Exclude<GalleryCategory, "all">;
  eyebrow: string;
  title: string;
  description: string;
};

const categoryLabels: Record<GalleryCategory, string> = {
  all: "全部",
  campus: "校区",
  classroom: "课堂",
  materials: "教材",
  events: "活动",
};

const galleryCopy: Record<string, Omit<GalleryItemView, keyof GalleryItem>> = {
  g1: {
    category: "campus",
    eyebrow: "Night Campus",
    title: "夜景校区路人视角",
    description: "街角灯光和门头一起成为家长第一次抵达时的视觉记忆。",
  },
  g2: {
    category: "classroom",
    eyebrow: "Evening Class",
    title: "晚间课堂实况",
    description: "晚间班保持紧凑节奏，孩子在互动中完成听说输入和表达练习。",
  },
  g3: {
    category: "campus",
    eyebrow: "Exterior",
    title: "机构外貌",
    description: "清晰、稳定、可识别的校区外观，让到访和接送都更安心。",
  },
  g4: {
    category: "materials",
    eyebrow: "Cambridge Materials",
    title: "剑桥原版教材",
    description: "教材体系承接启蒙、进阶和综合能力训练，方便长期规划。",
  },
  g5: {
    category: "classroom",
    eyebrow: "Speaking Interaction",
    title: "小组讨论&口语互动",
    description: "小组表达让孩子有更多开口机会，也更容易被老师观察到状态。",
  },
  g6: {
    category: "campus",
    eyebrow: "Night View",
    title: "夜间校区外景",
    description: "夜间外景强调安全抵达、明亮识别和真实校区环境。",
  },
  g7: {
    category: "events",
    eyebrow: "Holiday Gifts",
    title: "节日专属礼品",
    description: "节日活动把课堂记忆延伸到日常，让孩子保持学习期待。",
  },
  g8: {
    category: "events",
    eyebrow: "Parent Observation",
    title: "课堂观摩与家校共育",
    description: "家长能看到孩子在课堂中的状态，沟通也更具体、更有依据。",
  },
  g9: {
    category: "events",
    eyebrow: "Open Class",
    title: "家长公开课",
    description: "公开课让课程目标、课堂节奏和孩子表现被清楚看见。",
  },
  g10: {
    category: "classroom",
    eyebrow: "Holiday Class",
    title: "假期班小班实况",
    description: "假期小班用更集中的时间完成输入、练习和复盘。",
  },
};

export function MissionGallery({ items, title, subtitle }: { items: GalleryItem[]; title: string; subtitle: string }) {
  const galleryItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        ...(galleryCopy[item.id] ?? {
          category: "classroom",
          eyebrow: "Gallery",
          title: item.caption,
          description: "英创起点课堂与校区风采记录。",
        }),
      })) as GalleryItemView[],
    [items],
  );

  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [activeId, setActiveId] = useState(galleryItems[0]?.id ?? "");

  const filteredItems = activeCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory);
  const activeItem = filteredItems.find((item) => item.id === activeId) ?? filteredItems[0] ?? galleryItems[0];

  function selectCategory(category: GalleryCategory) {
    setActiveCategory(category);
    const nextItems = category === "all" ? galleryItems : galleryItems.filter((item) => item.category === category);
    setActiveId(nextItems[0]?.id ?? "");
  }

  if (!activeItem) {
    return null;
  }

  return (
    <section className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent sm:text-xs sm:tracking-[0.3em]">{subtitle}</p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0 md:pb-0">
          {(Object.keys(categoryLabels) as GalleryCategory[]).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition sm:px-4 ${
                activeCategory === category
                  ? "border-accent bg-accent text-white shadow-lg shadow-accent/20"
                  : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/30 hover:text-white"
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <figure className="group relative min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl md:min-h-[560px]">
          <Image
            src={activeItem.imageUrl}
            alt={activeItem.caption}
            fill
            priority
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/28 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/75 backdrop-blur-md sm:hidden">
            {filteredItems.findIndex((item) => item.id === activeItem.id) + 1}/{filteredItems.length}
          </div>
          <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent sm:text-xs sm:tracking-[0.28em]">{activeItem.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-5xl">{activeItem.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:mt-3 sm:text-base">{activeItem.description}</p>
          </figcaption>
        </figure>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-1">
          {filteredItems.slice(0, 5).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`group grid w-[82%] shrink-0 snap-start grid-cols-[82px_1fr] gap-3 rounded-2xl border p-2 text-left transition sm:w-auto sm:shrink sm:grid-cols-[88px_1fr] ${
                item.id === activeItem.id ? "border-accent/70 bg-accent/10" : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <div className="relative h-20 overflow-hidden rounded-xl border border-white/10 sm:h-24">
                <Image src={item.imageUrl} alt={item.caption} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="88px" />
              </div>
              <div className="min-w-0 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Log {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-1 truncate text-sm font-bold text-white">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/55">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="hidden gap-3 overflow-x-auto pb-2 md:flex">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`relative h-28 w-44 shrink-0 overflow-hidden rounded-2xl border transition ${
              item.id === activeItem.id ? "border-accent" : "border-white/10 opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" sizes="176px" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-left text-xs font-semibold text-white">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
