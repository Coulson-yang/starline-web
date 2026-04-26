"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function MissionNavCard({
  title,
  subtitle,
  href,
  metric,
  index,
}: {
  title: string;
  subtitle: string;
  href: string;
  metric: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={href}
        className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 transition hover:border-accent/60 hover:shadow-[0_20px_80px_rgba(247,127,0,0.18)]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">{metric}</p>
          <h3 className="mt-3 text-2xl font-black tracking-tighter text-white">{title}</h3>
          <p className="mt-2 text-sm text-white/65">{subtitle}</p>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-white/80">
          <span className="transition group-hover:text-white">进入子系统</span>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition group-hover:border-accent group-hover:text-accent">
            Open
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}
