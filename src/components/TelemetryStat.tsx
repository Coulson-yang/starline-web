"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect } from "react";

export function TelemetryStat({
  label,
  value,
  suffix,
  hint,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
}) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("zh-CN"));

  useEffect(() => {
    if (typeof value !== "number" || reduceMotion) return;
    const controls = animate(count, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [count, value, reduceMotion]);

  const display =
    typeof value === "number" ? (
      reduceMotion ? (
        <span>{value.toLocaleString("zh-CN")}</span>
      ) : (
        <motion.span>{rounded}</motion.span>
      )
    ) : (
      <span>{value}</span>
    );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(247,127,0,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">{label}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <p className="text-4xl font-black tracking-tighter text-white sm:text-5xl">{display}</p>
        {suffix ? <span className="text-lg font-semibold text-accent">{suffix}</span> : null}
      </div>
      {hint ? <p className="mt-2 text-sm text-white/60">{hint}</p> : null}
    </div>
  );
}
