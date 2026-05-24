"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function AboutHeroSection() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const start = window.innerHeight * 1.2;
      const range = window.innerHeight * 0.7;
      const p = Math.max(0, Math.min(1, (y - start) / range));
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

  const overlayOpacity = 0.06 + progress * 0.72;
  const contentOpacity = Math.max(0.08, progress);
  const contentTranslate = (1 - progress) * 30;

  return (
    <section className="relative isolate h-screen w-full overflow-hidden">
      <Image src="/images/hero-poster-2.jpg" alt="关于英创起点背景" fill className="object-cover object-center" sizes="100vw" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-deepSpace/75 via-deepSpace/55 to-deepSpace/70 transition-opacity duration-200"
        style={{ opacity: overlayOpacity }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-4" style={{ opacity: contentOpacity, transform: `translateY(${contentTranslate}px)` }}>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">ABOUT START LINE</p>
          <h2 className="mt-3 text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl">关于英创起点</h2>
        </div>

        <div className="relative mt-14 -mx-1 flex snap-x snap-mandatory gap-9 overflow-x-auto px-1 [&>article]:w-[94%] [&>article]:shrink-0 [&>article]:snap-start md:mx-0 md:grid md:grid-cols-2 md:gap-14 md:overflow-visible md:px-0 md:[&>article]:w-auto md:[&>article]:shrink lg:grid-cols-3 lg:gap-16">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">外教+中教 双师授课</h3>
            <p className="mt-3 text-base leading-8 text-white/70 sm:text-lg">我们采用“外教搭中教”一起上课的模式。外教营造沉浸式英语环境，培养语感；中教辅助理解，确保知识吸收。</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">开发语言思维</h3>
            <p className="mt-3 text-base leading-8 text-white/70 sm:text-lg">注重培养兴趣，不仅提高听说读写能力，更致力于搭建完整的语言体系，开发孩子的英语逻辑思维。</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">剑桥原版教材</h3>
            <p className="mt-3 text-base leading-8 text-white/70 sm:text-lg">使用剑桥原版教材 Kid&apos;s Box 和 Guess What!，内容生动有趣，接轨国际标准，拓宽国际视野。</p>
          </article>
        </div>
      </div>
    </section>
  );
}
