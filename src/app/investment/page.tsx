import type { Metadata } from "next";
import { GhostButton } from "@/components/ui/GhostButton";
import { getInstitutionData } from "@/lib/get-institution-data";
import { siteDescription } from "@/lib/site";
import constants from "@/data/constants.json";

export const metadata: Metadata = {
  title: "投资与价值",
  description: `${siteDescription} 收费方案、包含项与退费说明。`,
  openGraph: { title: "投资与价值 · 英创起点", description: `${siteDescription} 收费方案、包含项与退费说明。` },
  twitter: { title: "投资与价值 · 英创起点", description: `${siteDescription} 收费方案、包含项与退费说明。` },
};

const courseTypeIcons = {
  kids: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M6 10v1a6 6 0 0 0 12 0v-1" />
      <path d="M12 17v4" />
      <path d="M9 21h6" />
    </svg>
  ),
  teens: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 6h11" />
      <path d="M12 3v16" />
    </svg>
  ),
  exam: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.2-.9L12 3Z" />
    </svg>
  ),
  adult: (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <path d="M24 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M18 3.1a4 4 0 0 1 0 7.8" />
    </svg>
  ),
} as const;

export default async function InvestmentPage() {
  const data = await getInstitutionData();
  const plans = data.pricing.plans;
  const planTitles = constants.investment.planTitles;
  const semesterRows = constants.investment.semesterRows;
  const semesterPerks = constants.investment.semesterPerks;
  const holidayRows = constants.investment.holidayRows;
  const holidayPerks = constants.investment.holidayPerks;
  const courseTypes = constants.investment.courseTypes;

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">SERVICES & POLICIES</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">课程类型 · 收费政策</h1>
        <p className="max-w-3xl text-base text-white/70">下列方案仅限小班制教学，更多学习类型和定制VIP课程请点击“预约试听”添加老师进行咨询。</p>
        <GhostButton href={data.brand.trialCtaHref} variant="accent">
          {data.brand.trialCtaLabel}
        </GhostButton>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            课程类型 <span className="ml-2 text-lg font-medium text-white/60">Course Types</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {courseTypes.map((item) => {
            const headerTone = item.tone === "primary" ? "bg-white/10" : "bg-accent/20";
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-[5px] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              >
                <div className={`flex items-center justify-between px-5 py-4 ${headerTone}`}>
                  <div className="rounded-full bg-white/10 p-2.5 text-white">{courseTypeIcons[item.id as keyof typeof courseTypeIcons]}</div>
                  <span className="rounded-full border border-white/20 bg-deepSpace/70 px-3 py-1 text-xs font-semibold text-white">{item.tag}</span>
                </div>

                <div className="space-y-2 px-5 py-5">
                  <h3 className="text-xl font-black text-white">{item.title}</h3>
                  <p className="text-sm leading-6 text-white/70">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            收费政策 <span className="ml-2 text-lg font-medium text-white/60">Pricing Policy</span>
          </h2>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {plans.map((plan, index) => {
            const isRecommended = index === 0;
            return (
              <article
                key={plan.id}
                className={`group min-w-[85vw] snap-center rounded-3xl border p-6 transition duration-300 sm:min-w-0 ${
                  isRecommended
                    ? "border-accent/70 bg-accent/10 shadow-[0_20px_80px_rgba(247,127,0,0.25)] hover:-translate-y-[5px] hover:shadow-[0_26px_90px_rgba(247,127,0,0.3)]"
                    : "border-white/10 bg-white/[0.03] hover:-translate-y-[5px] hover:border-accent/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">{plan.name}</p>
                    <h3 className="text-2xl font-black tracking-tighter text-white">{planTitles[index] ?? plan.headline}</h3>
                  </div>
                  {isRecommended ? <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">Recommended</span> : null}
                </div>
                <p className="mt-4 text-3xl font-black text-accent">{plan.priceDisplay}</p>
                {index === 0 ? (
                  <>
                    <dl className="mt-6 space-y-3 text-sm text-white/75">
                      {semesterRows.map((row) => (
                        <div key={row.label} className="flex justify-between border-b border-white/5 pb-2">
                          <dt>{row.label}</dt>
                          <dd className="font-semibold text-white">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                      {semesterPerks.map((perk) => (
                        <li key={perk} className="flex gap-2">
                          <span className="text-accent">▹</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : index === 1 ? (
                  <>
                    <dl className="mt-6 space-y-3 text-sm text-white/75">
                      {holidayRows.map((row) => (
                        <div key={row.label} className="flex justify-between border-b border-white/5 pb-2">
                          <dt>{row.label}</dt>
                          <dd className="font-semibold text-white">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                      {holidayPerks.map((perk) => (
                        <li key={perk} className="flex gap-2">
                          <span className="text-accent">▹</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : index === 2 ? (
                  <ul className="mt-6 space-y-2 text-sm text-white/70">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex gap-2">
                        <span className="text-accent">▹</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <dl className="mt-6 space-y-3 text-sm text-white/75">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <dt>课时数</dt>
                        <dd className="font-semibold text-white">{plan.lessonHours} 小时</dd>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <dt>教材费</dt>
                        <dd className="font-semibold text-white">{plan.materialFeeDisplay}</dd>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <dt>活动费</dt>
                        <dd className="font-semibold text-white">{plan.activityFeeDisplay}</dd>
                      </div>
                    </dl>
                    <ul className="mt-4 space-y-2 text-sm text-white/70">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex gap-2">
                          <span className="text-accent">▹</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <h2 className="text-2xl font-black tracking-tight text-white">{data.pricing.refundPolicyTitle}</h2>
        <p className="mt-4 text-base leading-relaxed text-white/70">{data.pricing.refundPolicyBody}</p>
      </section>
    </div>
  );
}
