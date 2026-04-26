"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { InstitutionData } from "@/lib/institution-schema";

type GradeFilter = "all" | string;
type Session = InstitutionData["schedule"]["sessions"][number];

function gradeText(klass: InstitutionData["classes"][number]) {
  if (klass.gradeLabel) return klass.gradeLabel;
  const cn = ["零", "一", "二", "三", "四", "五", "六"];
  return `${cn[klass.level] ?? klass.level}年级`;
}

function classNameText(name: string) {
  return name.replace(/班$/, "");
}

const hiddenClassIds = new Set(["c-orion", "c-luna", "c-nova", "c-atlas"]);
const weekDayMap = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function minutesLabel(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function ClassTimePopover({ klass, sessions }: { klass: InstitutionData["classes"][number]; sessions: Session[] }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const classSchedule = useMemo(() => {
    const unique = new Map<string, Session>();
    sessions
      .filter((item) => item.classId === klass.id)
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startMinutes - b.startMinutes)
      .forEach((item) => {
        const key = `${item.dayOfWeek}-${item.startMinutes}-${item.endMinutes}`;
        if (!unique.has(key)) unique.set(key, item);
      });

    return Array.from(unique.values());
  }, [sessions, klass.id]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), 1500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setOpen(false);
  };

  const handleClick = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 transition hover:border-accent/50 hover:text-white"
      >
        {gradeText(klass)}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-0 z-30 w-[260px] -translate-x-1/2 -translate-y-[calc(100%+10px)]"
          >
            <div className="rounded-2xl border border-accent/70 bg-deepSpace/95 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="mb-2 border-l-2 border-accent pl-2">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Class Schedule</p>
              </div>
              <ul className="space-y-1.5 text-xs text-white/85">
                {classSchedule.length ? (
                  classSchedule.map((item) => (
                    <li key={item.id}>
                      {weekDayMap[item.dayOfWeek]} {minutesLabel(item.startMinutes)} - {minutesLabel(item.endMinutes)}
                    </li>
                  ))
                ) : (
                  <li>暂无排课</li>
                )}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FleetBoard({
  classes,
  teachers,
  sessions,
}: {
  classes: InstitutionData["classes"];
  teachers: InstitutionData["teachers"];
  sessions: Session[];
}) {
  const [grade, setGrade] = useState<GradeFilter>("all");

  const teacherMap = useMemo(() => Object.fromEntries(teachers.map((t) => [t.id, t])), [teachers]);

  const visibleClasses = useMemo(() => classes.filter((item) => !hiddenClassIds.has(item.id)), [classes]);

  const gradeOptions = useMemo(() => {
    const labels = Array.from(new Set(visibleClasses.map((item) => gradeText(item))));
    return ["all", ...labels] as GradeFilter[];
  }, [visibleClasses]);

  const filtered = useMemo(() => {
    if (grade === "all") return visibleClasses;
    return visibleClasses.filter((item) => gradeText(item) === grade);
  }, [visibleClasses, grade]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {gradeOptions.map((chip) => {
          const active = grade === chip;
          const label = chip === "all" ? "全部年级" : chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setGrade(chip)}
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition ${
                active ? "border-accent bg-accent text-white" : "border-white/15 text-white/70 hover:border-accent/60 hover:text-white"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((klass) => {
          const mappedTeacherIds = klass.teacherIds?.length ? klass.teacherIds : [klass.teacherId];
          const mappedTeachers = Array.from(new Set(mappedTeacherIds)).map((id) => teacherMap[id]).filter(Boolean);
          const ratio = Math.min(100, Math.round((klass.enrolled / klass.capacity) * 100));

          return (
            <article key={klass.id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {klass.material ? <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">{klass.material}</p> : null}
                  <h3 className="mt-1 text-2xl font-black tracking-tight text-white">{classNameText(klass.name)}</h3>
                </div>
                <ClassTimePopover klass={klass} sessions={sessions} />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>在班人数</span>
                  <span className="font-semibold text-white">
                    {klass.enrolled}/{klass.capacity}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-white" style={{ width: `${ratio}%` }} />
                </div>
                <p className="mt-1 text-xs text-white/50">{klass.capacity - klass.enrolled > 0 ? `余 ${klass.capacity - klass.enrolled} 席` : "满班"}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {mappedTeachers.map((teacher, idx) => (
                  <div key={`${klass.id}-teacher-${idx}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-deepSpace/60 p-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10">
                      <Image src={teacher.portraitUrl} alt={teacher.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Teacher</p>
                      <p className="text-base font-bold text-white">{teacher.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">Student roster</p>
                <ul className="mt-2 space-y-2 text-sm text-white/75">
                  {klass.students.map((student) => (
                    <li key={student.alias} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2">
                      <span>{student.alias}</span>
                      <span className={student.gender === "female" ? "text-pink-400" : "text-sky-400"} aria-label={student.gender === "female" ? "女" : "男"}>
                        {student.gender === "female" ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M12 12v8" />
                            <path d="M9 17h6" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="10" cy="14" r="4" />
                            <path d="m14 10 6-6" />
                            <path d="M15 4h5v5" />
                          </svg>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
