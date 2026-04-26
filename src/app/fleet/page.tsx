import type { Metadata } from "next";
import { FleetBoard } from "@/components/FleetBoard";
import { getInstitutionData } from "@/lib/get-institution-data";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "舰队状态",
  description: `${siteDescription} 班级容量、教师与脱敏学员信息。`,
  openGraph: { title: "舰队状态 · 英创起点", description: `${siteDescription} 班级容量、教师与脱敏学员信息。` },
  twitter: { title: "舰队状态 · 英创起点", description: `${siteDescription} 班级容量、教师与脱敏学员信息。` },
};

export default async function FleetPage() {
  const data = await getInstitutionData();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Class & Student Info</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">班级&同学信息</h1>
        <p className="max-w-3xl text-base text-white/70">您可以在这里查看每个班级的任课老师和学生信息。</p>
      </header>
      <FleetBoard classes={data.classes} teachers={data.teachers} sessions={data.schedule.sessions} />
    </div>
  );
}
