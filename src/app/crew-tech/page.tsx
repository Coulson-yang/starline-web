import type { Metadata } from "next";
import Image from "next/image";
import { getInstitutionData } from "@/lib/get-institution-data";
import { siteDescription } from "@/lib/site";
import constants from "@/data/constants.json";

export const metadata: Metadata = {
  title: "乘员与技术",
  description: `${siteDescription} 师资、教材与课堂展示。`,
  openGraph: { title: "乘员与技术 · 英创起点", description: `${siteDescription} 师资、教材与课堂展示。` },
  twitter: { title: "乘员与技术 · 英创起点", description: `${siteDescription} 师资、教材与课堂展示。` },
};

export default async function CrewTechPage() {
  const data = await getInstitutionData();
  const ui = constants.crewTech;
  const teacherQuotes = ui.teacherQuotes as Record<string, { en: string; zh: string }>;

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{ui.header.eyebrow}</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">{ui.header.title}</h1>
        <p className="max-w-3xl text-base text-white/70">{ui.header.desc}</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white">{ui.sections.crewTitle}</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">{ui.sections.crewSub}</span>
        </div>
        <div className="space-y-8">
          {data.teachers.map((teacher) => (
            <article key={teacher.id} className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 lg:grid-cols-[320px_1fr]">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10">
                <Image src={teacher.portraitUrl} alt={teacher.name} fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" />
              </div>
              <div className="flex min-h-full flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-accent">{teacher.code}</p>
                  <h3 className="text-3xl font-black tracking-tighter text-white">{teacher.name}</h3>
                  <p className="text-sm text-white/60">
                    {teacher.country} · 教龄 {teacher.yearsExperience} 年
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="space-y-4">
                  {teacher.bio.includes("1.") ? (
                    <ul className="space-y-2 text-base leading-relaxed text-white/75">
                      {teacher.bio
                        .split(/\s*\d+\.\s*/)
                        .filter(Boolean)
                        .map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="mt-1 text-accent">▹</span>
                            <span>{line}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-base leading-relaxed text-white/75">{teacher.bio}</p>
                  )}
                </div>

                {teacherQuotes[teacher.id] ? (
                  <div className="rounded-2xl border border-white/10 bg-deepSpace/60 p-4">
                    <p
                      className="text-lg leading-snug text-white"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      {teacherQuotes[teacher.id].en}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-white/80">{teacherQuotes[teacher.id].zh}</p>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>


      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white">{ui.sections.galleryTitle}</h2>
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">{ui.sections.gallerySub}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data.gallery.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="relative h-56 w-full">
                <Image src={item.imageUrl} alt={item.caption} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <figcaption className="px-4 py-3 text-sm text-white/70">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
