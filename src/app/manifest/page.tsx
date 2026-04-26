import type { Metadata } from "next";
import { ManifestBoard } from "@/components/ManifestBoard";
import { getInstitutionData } from "@/lib/get-institution-data";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "任务排期",
  description: `${siteDescription} 周视图课表与发射窗口。`,
  openGraph: { title: "任务排期 · 英创起点", description: `${siteDescription} 周视图课表与发射窗口。` },
  twitter: { title: "任务排期 · 英创起点", description: `${siteDescription} 周视图课表与发射窗口。` },
};

export default async function ManifestPage() {
  const data = await getInstitutionData();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:space-y-10 sm:py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">CURRICULUM ARRANGEMENT</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">班级排课表</h1>
        <p className="max-w-3xl text-base text-white/70">您可以在这里查看各个班级的上课时间，以及班级等级</p>
      </header>
      <ManifestBoard schedule={data.schedule} classes={data.classes} teachers={data.teachers} ageDistribution={data.ageDistribution} />
    </div>
  );
}
