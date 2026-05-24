"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CountUpNumber } from "@/components/CountUpNumber";

type LiveStat = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  hint: string;
};

export function StatsHeroSection({ stats }: { stats: LiveStat[] }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const p = Math.max(0, Math.min(1, y / (window.innerHeight * 0.7)));
      setProgress(p);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const overlayOpacity = 0.08 + progress * 0.62;
  const textOpacity = Math.max(0.1, progress);
  const textTranslate = (1 - progress) * 28;

  return (
    <section className="relative isolate h-screen w-full overflow-hidden">
      <Image src="/images/hero-poster-1.jpg" alt="数据展示背景" fill priority className="scale-[1.08] object-cover object-center" sizes="100vw" />
      <div
        className="absolute inset-x-0 top-0 h-[58vh] bg-gradient-to-b from-[#020712] via-[#071225] to-transparent transition-opacity duration-200"
        style={{ opacity: overlayOpacity }}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div
          className="grid w-full max-w-6xl grid-cols-1 gap-8 text-center transition-all duration-300 sm:grid-cols-3 sm:gap-10"
          style={{ opacity: textOpacity, transform: `translateY(${textTranslate}px)` }}
        >
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent/90 sm:text-base">{stat.label}</p>
              <p
                className="text-4xl font-black tracking-[0.06em] text-white sm:text-5xl lg:text-6xl"
                style={{ textShadow: "0 4px 18px rgba(0,0,0,0.68), 0 1px 2px rgba(0,0,0,0.75)" }}
              >
                <CountUpNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p
                className="mx-auto max-w-[220px] text-xs font-light leading-6 tracking-[0.06em] text-white/80 sm:text-sm"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.65), 0 1px 1px rgba(0,0,0,0.7)" }}
              >
                {stat.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
