import type { Metadata } from "next";
import { AttendanceBoard } from "@/components/AttendanceBoard";
import { getInstitutionData } from "@/lib/get-institution-data";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "学生考勤",
  description: `${siteDescription} 班级学生出勤记录与隐私保护。`,
  openGraph: { title: "学生考勤 · 英创起点", description: `${siteDescription} 班级学生出勤记录与隐私保护。` },
  twitter: { title: "学生考勤 · 英创起点", description: `${siteDescription} 班级学生出勤记录与隐私保护。` },
};

export default async function AttendancePage() {
  const data = await getInstitutionData();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">STUDENT ATTENDANCE</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">学生考勤</h1>
        <p className="max-w-3xl text-base text-white/70">班级签到矩阵支持授权访问、状态快速标记与自动本地保存。</p>
      </header>

      <AttendanceBoard classes={data.classes} />
    </div>
  );
}
