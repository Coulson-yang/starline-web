"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { InstitutionData } from "@/lib/institution-schema";

type Session = InstitutionData["schedule"]["sessions"][number];

type TimeSlot = {
  id: string;
  label: string;
  start: number;
  end: number;
};

const weekdayColumns = [
  { day: 3, label: "周三" },
  { day: 4, label: "周四" },
  { day: 5, label: "周五" },
] as const;

const weekendColumns = [
  { day: 6, label: "周六" },
  { day: 0, label: "周日" },
] as const;

const weekdaySlots: TimeSlot[] = [
  { id: "wd-1", label: "18:30-19:30", start: 18 * 60 + 30, end: 19 * 60 + 30 },
  { id: "wd-2", label: "19:30-20:20", start: 19 * 60 + 30, end: 20 * 60 + 20 },
  { id: "wd-3", label: "20:30-21:30", start: 20 * 60 + 30, end: 21 * 60 + 30 },
];

const weekendSlots: TimeSlot[] = [
  { id: "we-1", label: "08:30-10:10", start: 8 * 60 + 30, end: 10 * 60 + 10 },
  { id: "we-2", label: "10:30-12:10", start: 10 * 60 + 30, end: 12 * 60 + 10 },
  { id: "we-3", label: "15:30-17:10", start: 15 * 60 + 30, end: 17 * 60 + 10 },
];


function useNowTicker(stepMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), stepMs);
    return () => window.clearInterval(id);
  }, [stepMs]);
  return now;
}

function isSessionInSlot(session: Session, slot: TimeSlot) {
  return session.startMinutes < slot.end && session.endMinutes > slot.start;
}

function findSessionsForCell(sessions: Session[], dayOfWeek: number, slot: TimeSlot) {
  return sessions.filter((session) => session.dayOfWeek === dayOfWeek && isSessionInSlot(session, slot));
}

function classDisplayTitle(session: Session) {
  return session.title.replace(/班$/, "");
}

function classSeatDots(session: Session, classes: InstitutionData["classes"]) {
  const classInfo = classes.find((c) => c.id === session.classId);
  const capacity = Math.max(1, Math.min(10, classInfo?.capacity ?? 10));
  const enrolled = Math.max(0, Math.min(capacity, classInfo?.enrolled ?? 0));
  return Array.from({ length: capacity }, (_, index) => index < enrolled);
}

const weekDayMap = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function minutesLabel(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function ClassSchedulePopoverCard({
  session,
  sessions,
  classes,
  teachers,
  live,
  showSeatDots,
}: {
  session: Session;
  sessions: Session[];
  classes: InstitutionData["classes"];
  teachers: InstitutionData["teachers"];
  live: boolean;
  showSeatDots: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const classSchedule = useMemo(() => {
    const unique = new Map<string, Session>();
    sessions
      .filter((item) => item.classId === session.classId)
      .sort((a, b) => (a.dayOfWeek - b.dayOfWeek) || (a.startMinutes - b.startMinutes))
      .forEach((item) => {
        const key = `${item.dayOfWeek}-${item.startMinutes}-${item.endMinutes}`;
        if (!unique.has(key)) unique.set(key, item);
      });

    return Array.from(unique.values()).slice(0, 2);
  }, [sessions, session.classId]);

  const teacherText = useMemo(() => {
    const klass = classes.find((item) => item.id === session.classId);
    if (!klass) return "";
    const ids = klass.teacherIds?.length ? klass.teacherIds : [klass.teacherId];
    const names = Array.from(new Set(ids))
      .map((id) => teachers.find((t) => t.id === id)?.name)
      .filter((name): name is string => Boolean(name));
    return names.join(" & ");
  }, [classes, teachers, session.classId]);

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
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className="cursor-pointer rounded-xl border border-white/10 bg-deepSpace/70 p-1 text-[10px] text-white/80 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_10px_26px_rgba(0,0,0,0.35)] sm:p-3 sm:text-xs"
      >
        <div className="flex items-start justify-between gap-2 md:gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="text-[11px] font-semibold leading-4 text-white md:text-xs">{classDisplayTitle(session)}</span>
              {live ? <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white md:px-2 md:text-[10px]">LIVE</span> : null}
            </div>
            <p className="mt-1.5 text-[10px] leading-4 text-white/60 md:mt-2 md:text-[11px]">{teacherText || "待排教师"}</p>
          </div>
          {showSeatDots ? (
            <div className="hidden grid-cols-5 gap-1.5 pt-0.5 md:grid" aria-label="班级人数圆点">
              {classSeatDots(session, classes).map((filled, idx) => (
                <span
                  key={`${session.id}-dot-${idx}`}
                  className={`h-2.5 w-2.5 rounded-full border ${filled ? "border-accent bg-accent" : "border-white/40 bg-transparent"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-0 z-30 w-[200px] -translate-x-1/2 -translate-y-[calc(100%+8px)]"
          >
            <div className="rounded-xl border border-accent/70 bg-deepSpace/95 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur">
              <ul className="space-y-1 text-[11px] leading-4 text-white/85">
                {classSchedule.map((item) => (
                  <li key={item.id}>
                    {weekDayMap[item.dayOfWeek]} {minutesLabel(item.startMinutes)} - {minutesLabel(item.endMinutes)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ScheduleMatrix({
  title,
  columns,
  slots,
  sessions,
  liveId,
  classes,
  teachers,
  showSeatDots,
}: {
  title: string;
  columns: ReadonlyArray<{ day: number; label: string }>;
  slots: TimeSlot[];
  sessions: Session[];
  liveId: string | null;
  classes: InstitutionData["classes"];
  teachers: InstitutionData["teachers"];
  showSeatDots: boolean;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="mt-4 overflow-x-auto rounded-xl">
        <table className="w-full min-w-0 table-fixed border-separate border-spacing-1 text-[10px] sm:border-spacing-2 sm:text-xs">
          <thead>
            <tr>
              <th className="rounded-xl bg-white/5 px-1 py-2 text-center text-[10px] font-semibold tracking-wide text-white/70 sm:px-3 sm:py-3 sm:text-xs">时间段</th>
              {columns.map((column) => (
                <th key={column.day} className="rounded-xl bg-white/5 px-1 py-2 text-center text-[10px] font-semibold tracking-wide text-white/70 sm:px-3 sm:py-3 sm:text-xs">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td className="rounded-xl border border-white/10 bg-deepSpace/60 px-1 py-2 text-center text-[10px] font-semibold text-white/85 sm:px-3 sm:py-3 sm:text-xs">{slot.label}</td>
                {columns.map((column) => {
                  const cellSessions = findSessionsForCell(sessions, column.day, slot);
                  const isWedThuNoClassLateSlot = slot.id === "wd-3" && (column.day === 3 || column.day === 4) && cellSessions.length === 0;
                  return (
                    <td
                      key={`${slot.id}-${column.day}`}
                      className={isWedThuNoClassLateSlot ? "p-0 align-top" : "rounded-xl border border-white/10 bg-white/[0.03] p-1 align-top sm:p-3"}
                    >
                      {cellSessions.length ? (
                        <div className="space-y-2">
                          {cellSessions.map((session) => {
                            const live = session.id === liveId;
                            return (
                              <ClassSchedulePopoverCard
                                key={session.id}
                                session={session}
                                sessions={sessions}
                                classes={classes}
                                teachers={teachers}
                                live={live}
                                showSeatDots={showSeatDots}
                              />
                            );
                          })}
                        </div>
                      ) : isWedThuNoClassLateSlot ? null : (
                        <p className="py-5 text-center text-[11px] text-white/35">无排期</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ManifestBoard({
  schedule,
  classes,
  teachers,
  ageDistribution,
}: {
  schedule: InstitutionData["schedule"];
  classes: InstitutionData["classes"];
  teachers: InstitutionData["teachers"];
  ageDistribution: InstitutionData["ageDistribution"];
}) {
  const now = useNowTicker();
  const liveId = useMemo(() => {
    const dow = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return schedule.sessions.find((session) => session.dayOfWeek === dow && minutes >= session.startMinutes && minutes < session.endMinutes)?.id ?? null;
  }, [now, schedule.sessions]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">学生年龄分布</h2>
            <p className="text-sm text-white/60">先使用示例数据，你后续可直接在本组件里修改各年龄人数。</p>
          </div>
          <p className="text-xs text-white/45">统计样本：在读学生（示例）</p>
        </div>

        {(() => {
          const total = ageDistribution.reduce((sum, item) => sum + item.count, 0);
          const max = Math.max(...ageDistribution.map((item) => item.count), 1);
          const pieStops = ageDistribution
            .reduce(
              (acc, item, index) => {
                const colorPalette = ["#25D9D2", "#F77F00", "#7DD3FC", "#A78BFA", "#34D399", "#F472B6", "#FACC15"];
                const start = acc.current;
                const span = total > 0 ? (item.count / total) * 100 : 0;
                const end = start + span;
                acc.current = end;
                acc.stops.push(`${colorPalette[index % colorPalette.length]} ${start}% ${end}%`);
                return acc;
              },
              { current: 0, stops: [] as string[] },
            )
            .stops.join(", ");

          return (
            <>
              <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
                <article className="rounded-2xl border border-white/10 bg-deepSpace/50 p-4">
                  <h3 className="text-sm font-semibold text-white/85">柱状图预览</h3>
                  <div className="mt-4 space-y-3">
                    {ageDistribution.map((item) => (
                      <div key={item.age} className="grid grid-cols-[52px_1fr_36px] items-center gap-3 text-xs">
                        <span className="text-white/70">{item.age}</span>
                        <div className="h-2.5 rounded-full bg-white/10">
                          <div className="h-2.5 rounded-full bg-accent" style={{ width: `${(item.count / max) * 100}%` }} />
                        </div>
                        <span className="text-right text-white/80">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-2xl border border-white/10 bg-deepSpace/50 p-4">
                  <h3 className="text-sm font-semibold text-white/85">饼图预览</h3>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-36 w-36 rounded-full" style={{ background: `conic-gradient(${pieStops})` }} aria-hidden="true" />
                    <ul className="space-y-1.5 text-xs text-white/75">
                      {ageDistribution.map((item) => (
                        <li key={`legend-${item.age}`} className="flex items-center justify-between gap-3">
                          <span>{item.age}</span>
                          <span>{total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0"}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>


            </>
          );
        })()}
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-white">课表</h2>
          <p className="text-xs text-white/50">当前系统时间：{now.toLocaleString("zh-CN")}</p>
        </div>
        <ScheduleMatrix
          title="周三 - 周五"
          columns={weekdayColumns}
          slots={weekdaySlots}
          sessions={schedule.sessions}
          liveId={liveId}
          classes={classes}
          teachers={teachers}
          showSeatDots={false}
        />
        <ScheduleMatrix
          title="周六 - 周日"
          columns={weekendColumns}
          slots={weekendSlots}
          sessions={schedule.sessions}
          liveId={liveId}
          classes={classes}
          teachers={teachers}
          showSeatDots={true}
        />
      </section>
    </div>
  );
}
