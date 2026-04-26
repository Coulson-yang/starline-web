"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import constants from "@/data/constants.json";
import type { InstitutionData } from "@/lib/institution-schema";

type ClassItem = InstitutionData["classes"][number];
type AttendanceStatus = "active" | "leave" | "empty";

type AttendanceStore = {
  classesMeta: Record<string, { className: string; students: string[] }>;
  datesByClass: Record<string, string[]>;
  statusByClass: Record<string, Record<string, AttendanceStatus>>;
  teacherMarksByClass: Record<string, string[]>;
  oneOnOne: {
    dates: string[];
    statusMap: Record<string, AttendanceStatus>;
  };
};

const STORAGE_KEY = "starline_class_data";
const LEGACY_STORAGE_KEY = "attendance-board-v1";
const AUTH_CODE = "8888";
const COLUMN_COUNT = 36;
const TEACHER_MARKS = ["R", "C", "S", "D"] as const;
const hiddenClassIds = new Set(["c-orion", "c-luna", "c-atlas", "c-nova"]);

function md(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${month}-${day}`;
}

function monthDayParts(value: string) {
  if (!value) return { month: "", day: "" };
  const parts = value.split("-");
  if (parts.length === 2) {
    const [m, d] = parts;
    return { month: String(Number(m) || ""), day: String(Number(d) || "") };
  }
  if (parts.length === 3) {
    const [, m, d] = parts;
    return { month: String(Number(m) || ""), day: String(Number(d) || "") };
  }
  return { month: "", day: "" };
}

function normalizeDateToken(value: string) {
  const parts = (value || "").split("-");
  if (parts.length === 2) {
    const [m, d] = parts;
    return `${`${Math.max(1, Math.min(12, Number(m) || 1))}`.padStart(2, "0")}-${`${Math.max(1, Math.min(31, Number(d) || 1))}`.padStart(2, "0")}`;
  }
  if (parts.length === 3) {
    const [, m, d] = parts;
    return `${`${Math.max(1, Math.min(12, Number(m) || 1))}`.padStart(2, "0")}-${`${Math.max(1, Math.min(31, Number(d) || 1))}`.padStart(2, "0")}`;
  }
  return md(new Date());
}

function monthDayToRank(value: string) {
  const normalized = normalizeDateToken(value);
  const [m, d] = normalized.split("-");
  return Number(m) * 100 + Number(d);
}

function defaultDates() {
  const now = new Date();
  return Array.from({ length: COLUMN_COUNT }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    return md(d);
  });
}

function classDisplayName(name: string) {
  return name.replace(/班$/, "");
}

function studentName(student: ClassItem["students"][number]) {
  return student.englishName ?? student.alias;
}

function emptyStore(): AttendanceStore {
  return {
    classesMeta: {},
    datesByClass: {},
    statusByClass: {},
    teacherMarksByClass: {},
    oneOnOne: {
      dates: defaultDates(),
      statusMap: {},
    },
  };
}

export function AttendanceBoard({ classes }: { classes: ClassItem[] }) {
  const ui = constants.attendance;
  const classOptions = useMemo(() => classes.filter((c) => c.students.length > 0 && !hiddenClassIds.has(c.id)), [classes]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const handleSave = useCallback(
    (updater: (current: AttendanceStore) => AttendanceStore) => {
      setIsSaving(true);
      setIsSynced(false);
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const base = raw ? ({ ...emptyStore(), ...(JSON.parse(raw) as Partial<AttendanceStore>) } as AttendanceStore) : emptyStore();
        const next = updater(base);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setIsSaving(false);
        setIsSynced(true);
        window.setTimeout(() => setIsSynced(false), 1200);
      } catch (error) {
        setIsSaving(false);
        if (error instanceof DOMException && (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
          window.alert(ui.alerts.quota);
        }
      }
    },
    [ui.alerts.quota],
  );
  const [unlocked, setUnlocked] = useState(false);
  const [authInput, setAuthInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [selectedClassId, setSelectedClassId] = useState(classOptions[0]?.id ?? "");
  const [dates, setDates] = useState<string[]>(defaultDates());
  const [teacherMarks, setTeacherMarks] = useState<string[]>(Array.from({ length: COLUMN_COUNT }, () => "R"));
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const [infoClassId, setInfoClassId] = useState(classOptions[0]?.id ?? "");
  const [infoStudentAlias, setInfoStudentAlias] = useState("");
  const [infoStartDate, setInfoStartDate] = useState("");
  const [infoDates, setInfoDates] = useState<string[]>(defaultDates());
  const [infoStatusMap, setInfoStatusMap] = useState<Record<string, AttendanceStatus>>({});

  const oneOnOneStudents = ui.oneOnOne.students as Array<{ name: string; track: string }>;
  const [oneDates, setOneDates] = useState<string[]>(defaultDates());
  const [oneStatusMap, setOneStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [oneHoverRow, setOneHoverRow] = useState<number | null>(null);
  const [oneHoverCol, setOneHoverCol] = useState<number | null>(null);
  const [oneSelectedName, setOneSelectedName] = useState("");

  const selectedClass = useMemo(() => classOptions.find((c) => c.id === selectedClassId) ?? null, [classOptions, selectedClassId]);

  const infoClass = useMemo(() => classOptions.find((c) => c.id === infoClassId) ?? null, [classOptions, infoClassId]);

  const infoStudents = useMemo(() => {
    if (!infoClass) return [] as ClassItem["students"];
    return infoClass.students;
  }, [infoClass]);

  const infoStudent = useMemo(() => {
    if (!infoClass) return null;
    return infoClass.students.find((s) => s.alias === infoStudentAlias) ?? null;
  }, [infoClass, infoStudentAlias]);

  const selectedStudentRows = useMemo(() => {
    if (!infoStudent) return [] as { date: string; status: AttendanceStatus }[];
    const startRank = infoStartDate ? monthDayToRank(infoStartDate) : 0;

    return Array.from({ length: COLUMN_COUNT })
      .map((_, colIdx) => {
        const key = `${infoStudent.alias}__${colIdx}`;
        const status = infoStatusMap[key] ?? "empty";
        const date = infoDates[colIdx] ?? "";
        return { date, status };
      })
      .filter((row) => !startRank || monthDayToRank(row.date) >= startRank);
  }, [infoStudent, infoStatusMap, infoDates, infoStartDate]);

  const oneSelectedStudent = useMemo(() => {
    if (!oneSelectedName) return oneOnOneStudents[0] ?? null;
    return oneOnOneStudents.find((s) => s.name === oneSelectedName) ?? null;
  }, [oneSelectedName, oneOnOneStudents]);

  const activeCount = selectedStudentRows.filter((row) => row.status === "active").length;
  const leaveCount = selectedStudentRows.filter((row) => row.status === "leave").length;

  useEffect(() => {
    // 版本升级：清空旧记录，保证考勤单元格初始为空
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setDates(defaultDates());
      setTeacherMarks(Array.from({ length: COLUMN_COUNT }, () => "R"));
      setStatusMap({});
      return;
    }
    try {
      const parsed = JSON.parse(raw) as AttendanceStore;
      if (!selectedClassId) return;
      setDates(parsed.datesByClass[selectedClassId] ?? defaultDates());
      setTeacherMarks(parsed.teacherMarksByClass?.[selectedClassId] ?? Array.from({ length: COLUMN_COUNT }, () => "R"));
      setStatusMap(parsed.statusByClass[selectedClassId] ?? {});
    } catch {
      setDates(defaultDates());
      setStatusMap({});
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (!selectedClassId) return;
    const currentClass = classOptions.find((c) => c.id === selectedClassId);

    handleSave((current) => {
      current.datesByClass[selectedClassId] = dates;
      current.teacherMarksByClass[selectedClassId] = teacherMarks;
      current.statusByClass[selectedClassId] = statusMap;
      current.classesMeta[selectedClassId] = {
        className: currentClass ? classDisplayName(currentClass.name) : selectedClassId,
        students: currentClass ? currentClass.students.map((s) => s.alias) : [],
      };
      return current;
    });
  }, [dates, teacherMarks, statusMap, selectedClassId, classOptions, handleSave]);

  useEffect(() => {
    handleSave((current) => {
      current.oneOnOne = {
        dates: oneDates,
        statusMap: oneStatusMap,
      };
      return current;
    });
  }, [oneDates, oneStatusMap, handleSave]);

  useEffect(() => {
    if (!selectedClassId && classOptions.length) setSelectedClassId(classOptions[0].id);
    if (!infoClassId && classOptions.length) setInfoClassId(classOptions[0].id);
  }, [classOptions, selectedClassId, infoClassId]);

  useEffect(() => {
    setInfoStudentAlias("");
  }, [infoClassId]);

  useEffect(() => {
    if (!oneSelectedName && oneOnOneStudents.length) {
      setOneSelectedName(oneOnOneStudents[0].name);
    }
  }, [oneSelectedName, oneOnOneStudents]);

  useEffect(() => {
    if (!infoClassId) return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setInfoDates(defaultDates());
      setInfoStatusMap({});
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<AttendanceStore>;
      setInfoDates(parsed.datesByClass?.[infoClassId] ?? defaultDates());
      setInfoStatusMap(parsed.statusByClass?.[infoClassId] ?? {});
      setOneDates(parsed.oneOnOne?.dates ?? defaultDates());
      setOneStatusMap(parsed.oneOnOne?.statusMap ?? {});
    } catch {
      setInfoDates(defaultDates());
      setInfoStatusMap({});
      setOneDates(defaultDates());
      setOneStatusMap({});
    }
  }, [infoClassId, dates, statusMap]);

  const onDateChange = (idx: number, value: string) => {
    setDates((prev) => prev.map((item, i) => (i === idx ? value : item)));
  };

  const cycleTeacherMark = (idx: number) => {
    setTeacherMarks((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const currentIndex = TEACHER_MARKS.indexOf((item as (typeof TEACHER_MARKS)[number]) ?? "R");
        const nextIndex = (currentIndex + 1) % TEACHER_MARKS.length;
        return TEACHER_MARKS[nextIndex];
      }),
    );
  };

  const toggleStatus = (student: string, colIdx: number) => {
    const key = `${student}__${colIdx}`;
    setStatusMap((prev) => {
      const current = prev[key] ?? "empty";
      const next: AttendanceStatus = current === "active" ? "leave" : "active";
      return { ...prev, [key]: next };
    });
  };

  const clearStatus = (student: string, colIdx: number) => {
    const key = `${student}__${colIdx}`;
    setStatusMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submitAuth = () => {
    if (authInput === AUTH_CODE) {
      setUnlocked(true);
      setAuthError("");
      return;
    }
    setAuthError(ui.lock.error);
  };

  const downloadBackup = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) ?? "{}";
      const blob = new Blob([raw], { type: "application/json;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "starline_backup.json";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert(ui.sheet.backupFailed);
    }
  };

  const onOneDateChange = (idx: number, month: string, day: string) => {
    const mm = String(Math.max(1, Math.min(12, Number(month || 1)))).padStart(2, "0");
    const dd = String(Math.max(1, Math.min(31, Number(day || 1)))).padStart(2, "0");
    setOneDates((prev) => prev.map((item, i) => (i === idx ? `${mm}-${dd}` : item)));
  };

  const toggleOneStatus = (student: string, colIdx: number) => {
    const key = `${student}__${colIdx}`;
    setOneStatusMap((prev) => {
      const current = prev[key] ?? "empty";
      const next: AttendanceStatus = current === "active" ? "leave" : "active";
      return { ...prev, [key]: next };
    });
  };

  const clearOneStatus = (student: string, colIdx: number) => {
    const key = `${student}__${colIdx}`;
    setOneStatusMap((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <div className="relative">
      {!unlocked ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deepSpace/65 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-deepSpace/90 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{ui.lock.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black text-white">{ui.lock.title}</h2>
            <p className="mt-2 text-sm text-white/65">{ui.lock.desc}</p>
            <input
              value={authInput}
              onChange={(e) => setAuthInput(e.target.value)}
              type="password"
              placeholder={ui.lock.placeholder}
              className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none transition focus:border-accent"
              onKeyDown={(e) => {
                if (e.key === "Enter") submitAuth();
              }}
            />
            {authError ? <p className="mt-2 text-sm text-accent">{authError}</p> : null}
            <button
              type="button"
              onClick={submitAuth}
              className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:brightness-110"
            >
              {ui.lock.unlock}
            </button>
            <Link
              href="/"
              className="mt-2 block w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white/85 transition hover:border-accent/70 hover:text-white"
            >
              {ui.lock.home}
            </Link>
          </div>
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{ui.sheet.eyebrow}</p>
            <h2 className="text-2xl font-black tracking-tight text-white">{ui.sheet.title}</h2>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-[560px]">
            <div className="flex items-center justify-end">
              {isSaving ? (
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  {ui.sheet.save}
                </span>
              ) : isSynced ? (
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  {ui.sheet.synced}
                </span>
              ) : null}
            </div>
            <div className="grid w-full gap-2 md:grid-cols-2">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
              >
                {classOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {classDisplayName(item.name)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={downloadBackup}
                className="rounded-xl border border-accent/70 bg-accent/15 px-3 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/25"
              >
                {ui.sheet.backup}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-deepSpace/50">
          <table className="min-w-[1680px] sm:min-w-[1900px] lg:min-w-[2300px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-white/10 bg-deepSpace px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {ui.sheet.studentHeader}
                </th>
                {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => (
                  <th
                    key={colIdx}
                    className={`border-b border-white/10 px-1 py-1 ${hoverCol === colIdx ? "bg-white/10" : "bg-deepSpace/85"}`}
                    onMouseEnter={() => setHoverCol(colIdx)}
                    onMouseLeave={() => setHoverCol(null)}
                  >
                    <div className="relative mx-auto flex h-14 w-14 flex-col items-center justify-center rounded-md border border-white/15 bg-white/5 px-1 py-1">
                      <button
                        type="button"
                        onClick={() => cycleTeacherMark(colIdx)}
                        className="absolute left-1 top-1 text-[9px] font-bold leading-none text-accent"
                        aria-label="切换上课教师缩写"
                      >
                        {teacherMarks[colIdx] ?? "R"}
                      </button>
                      <select
                        value={monthDayParts(dates[colIdx] ?? "").day || "1"}
                        onChange={(e) => {
                          const day = Math.max(1, Math.min(31, Number(e.target.value || 1)));
                          const current = normalizeDateToken(dates[colIdx] ?? "");
                          const [mm] = current.split("-");
                          onDateChange(colIdx, `${mm}-${`${day}`.padStart(2, "0")}`);
                        }}
                        className="w-full appearance-none border-0 bg-transparent text-center text-sm font-bold text-white outline-none"
                      >
                        {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((day) => (
                          <option key={day} value={day} className="bg-deepSpace text-white">
                            {day}
                          </option>
                        ))}
                      </select>
                      <div className="my-0.5 h-px w-8 bg-white/20" />
                      <select
                        value={monthDayParts(dates[colIdx] ?? "").month || "1"}
                        onChange={(e) => {
                          const month = Math.max(1, Math.min(12, Number(e.target.value || 1)));
                          const current = normalizeDateToken(dates[colIdx] ?? "");
                          const [, dd] = current.split("-");
                          onDateChange(colIdx, `${`${month}`.padStart(2, "0")}-${dd}`);
                        }}
                        className="w-full appearance-none border-0 bg-transparent text-center text-sm font-bold text-white outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((month) => (
                          <option key={month} value={month} className="bg-deepSpace text-white">
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedClass?.students.map((student, rowIdx) => (
                <tr key={`${selectedClass.id}-${student.alias}`}>
                  <td
                    className={`sticky left-0 z-10 border-r border-b border-white/10 px-3 py-2 text-sm font-semibold text-white ${hoverRow === rowIdx ? "bg-white/10" : "bg-deepSpace"}`}
                    onMouseEnter={() => setHoverRow(rowIdx)}
                    onMouseLeave={() => setHoverRow(null)}
                  >
                    {studentName(student)}
                  </td>
                  {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => {
                    const key = `${student.alias}__${colIdx}`;
                    const status = statusMap[key] ?? "empty";
                    const highlighted = hoverRow === rowIdx || hoverCol === colIdx;
                    return (
                      <td
                        key={key}
                        onMouseEnter={() => {
                          setHoverRow(rowIdx);
                          setHoverCol(colIdx);
                        }}
                        onMouseLeave={() => {
                          setHoverRow(null);
                          setHoverCol(null);
                        }}
                        onClick={() => toggleStatus(student.alias, colIdx)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          clearStatus(student.alias, colIdx);
                        }}
                        className={`cursor-pointer border-b border-l border-white/5 px-1 py-1 text-center text-xs transition ${highlighted ? "bg-white/10" : "bg-transparent hover:bg-white/5"}`}
                        style={{ width: 36, height: 36, minWidth: 36 }}
                      >
                        {status === "active" ? <span className="text-sm text-emerald-300">√</span> : status === "leave" ? <span className="text-sm font-semibold text-accent">假</span> : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{ui.info.eyebrow}</p>
            <h3 className="text-2xl font-black tracking-tight text-white">{ui.info.title}</h3>
          </div>
          <div className="grid w-full gap-2 md:w-[680px] md:grid-cols-3">
            <select
              value={infoClassId}
              onChange={(e) => setInfoClassId(e.target.value)}
              className="rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            >
              {classOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {classDisplayName(item.name)}
                </option>
              ))}
            </select>
            <select
              value={infoStudentAlias}
              onChange={(e) => setInfoStudentAlias(e.target.value)}
              className="rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            >
              <option value="">{ui.info.selectStudent}</option>
              {infoStudents.map((student) => (
                <option key={student.alias} value={student.alias}>
                  {studentName(student)}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={monthDayParts(infoStartDate).month || "1"}
                onChange={(e) => {
                  const month = String(Math.max(1, Math.min(12, Number(e.target.value || 1)))).padStart(2, "0");
                  const day = String(Math.max(1, Math.min(31, Number(monthDayParts(infoStartDate).day || 1)))).padStart(2, "0");
                  setInfoStartDate(`${month}-${day}`);
                }}
                className="rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((month) => (
                  <option key={`start-m-${month}`} value={month}>
                    {month}月
                  </option>
                ))}
              </select>
              <select
                value={monthDayParts(infoStartDate).day || "1"}
                onChange={(e) => {
                  const month = String(Math.max(1, Math.min(12, Number(monthDayParts(infoStartDate).month || 1)))).padStart(2, "0");
                  const day = String(Math.max(1, Math.min(31, Number(e.target.value || 1)))).padStart(2, "0");
                  setInfoStartDate(`${month}-${day}`);
                }}
                className="rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
              >
                {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((day) => (
                  <option key={`start-d-${day}`} value={day}>
                    {day}日
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-deepSpace/50 px-4 py-2 text-sm text-white/80">
            {ui.info.activeCount}：<span className="font-semibold text-emerald-300">{activeCount}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-deepSpace/50 px-4 py-2 text-sm text-white/80">
            {ui.info.leaveCount}：<span className="font-semibold text-accent">{leaveCount}</span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-deepSpace/50">
          <table className="min-w-[520px] w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="border-b border-white/10 px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-white/60">{ui.info.dateHeader}</th>
                <th className="border-b border-white/10 px-4 py-3 text-left text-xs uppercase tracking-[0.12em] text-white/60">{ui.info.statusHeader}</th>
              </tr>
            </thead>
            <tbody>
              {infoStudent ? (
                selectedStudentRows.map((row, idx) => (
                  <tr key={`${row.date}-${idx}`} className="border-b border-white/5 last:border-b-0">
                    <td className="px-4 py-2.5 text-white/85">{row.date}</td>
                    <td className="px-4 py-2.5">
                      {row.status === "active" ? (
                        <span className="text-emerald-300">{ui.info.active}</span>
                      ) : row.status === "leave" ? (
                        <span className="font-semibold text-accent">{ui.info.leave}</span>
                      ) : (
                        <span className="text-white/35">{ui.info.empty}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-white/45">
                    {ui.info.emptyTip}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{ui.oneOnOne.eyebrow}</p>
            <h3 className="text-2xl font-black tracking-tight text-white">{ui.oneOnOne.title}</h3>
          </div>
          <div className="w-full md:w-[280px]">
            <select
              value={oneSelectedStudent?.name ?? ""}
              onChange={(e) => setOneSelectedName(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-deepSpace/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            >
              {oneOnOneStudents.map((student) => (
                <option key={`one-select-${student.name}`} value={student.name}>
                  {student.name} · {student.track}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-deepSpace/50">
          <table className="min-w-[2300px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-r border-white/10 bg-deepSpace px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {ui.oneOnOne.studentHeader}
                </th>
                {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => (
                  <th
                    key={`one-date-${colIdx}`}
                    className={`border-b border-white/10 px-1 py-1 ${oneHoverCol === colIdx ? "bg-white/10" : "bg-deepSpace/85"}`}
                    onMouseEnter={() => setOneHoverCol(colIdx)}
                    onMouseLeave={() => setOneHoverCol(null)}
                  >
                    <div className="mx-auto flex w-14 flex-col items-center rounded-md border border-white/15 bg-white/5 px-1 py-1">
                      <select
                        value={monthDayParts(oneDates[colIdx] ?? "").day || "1"}
                        onChange={(e) => onOneDateChange(colIdx, monthDayParts(oneDates[colIdx] ?? "").month || "1", e.target.value)}
                        className="w-full appearance-none border-0 bg-transparent text-center text-sm font-bold text-white outline-none"
                      >
                        {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((day) => (
                          <option key={`one-d-${colIdx}-${day}`} value={day} className="bg-deepSpace text-white">
                            {day}
                          </option>
                        ))}
                      </select>
                      <div className="my-0.5 h-px w-8 bg-white/20" />
                      <select
                        value={monthDayParts(oneDates[colIdx] ?? "").month || "1"}
                        onChange={(e) => onOneDateChange(colIdx, e.target.value, monthDayParts(oneDates[colIdx] ?? "").day || "1")}
                        className="w-full appearance-none border-0 bg-transparent text-center text-sm font-bold text-white outline-none"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((month) => (
                          <option key={`one-m-${colIdx}-${month}`} value={month} className="bg-deepSpace text-white">
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oneSelectedStudent ? (
                <tr key={`one-${oneSelectedStudent.name}`}>
                  <td
                    className={`sticky left-0 z-10 border-r border-b border-white/10 px-3 py-2 text-sm font-semibold text-white ${oneHoverRow === 0 ? "bg-white/10" : "bg-deepSpace"}`}
                    onMouseEnter={() => setOneHoverRow(0)}
                    onMouseLeave={() => setOneHoverRow(null)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{oneSelectedStudent.name}</span>
                      <span className="text-xs font-normal text-white/55">{oneSelectedStudent.track}</span>
                    </div>
                  </td>
                  {Array.from({ length: COLUMN_COUNT }).map((_, colIdx) => {
                    const key = `${oneSelectedStudent.name}__${colIdx}`;
                    const status = oneStatusMap[key] ?? "empty";
                    const highlighted = oneHoverRow === 0 || oneHoverCol === colIdx;
                    return (
                      <td
                        key={key}
                        onMouseEnter={() => {
                          setOneHoverRow(0);
                          setOneHoverCol(colIdx);
                        }}
                        onMouseLeave={() => {
                          setOneHoverRow(null);
                          setOneHoverCol(null);
                        }}
                        onClick={() => toggleOneStatus(oneSelectedStudent.name, colIdx)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          clearOneStatus(oneSelectedStudent.name, colIdx);
                        }}
                        className={`cursor-pointer border-b border-l border-white/5 px-1 py-1 text-center text-xs transition ${highlighted ? "bg-white/10" : "bg-transparent hover:bg-white/5"}`}
                        style={{ width: 32, height: 32, minWidth: 32 }}
                      >
                        {status === "active" ? <span className="text-sm text-emerald-300">√</span> : status === "leave" ? <span className="text-sm font-semibold text-accent">假</span> : null}
                      </td>
                    );
                  })}
                </tr>
              ) : (
                <tr>
                  <td colSpan={COLUMN_COUNT + 1} className="px-4 py-8 text-center text-white/45">
                    未找到匹配学生
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
