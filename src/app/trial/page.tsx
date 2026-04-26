import type { Metadata } from "next";
import Image from "next/image";
import { siteDescription } from "@/lib/site";

export const metadata: Metadata = {
  title: "预约试听",
  description: `${siteDescription} 试听信息、联系方式与到访指引。`,
  openGraph: { title: "预约试听 · 英创起点", description: `${siteDescription} 试听信息、联系方式与到访指引。` },
  twitter: { title: "预约试听 · 英创起点", description: `${siteDescription} 试听信息、联系方式与到访指引。` },
};

const teacherQr = "/images/qr-wechat.jpg";
const douyinQr = "/images/qr-douyin.jpg";

const trialSteps = ["添加老师微信", "预约试听", "获取试听邀请函", "线下试听测试"];

const trialPhotos = [
  {
    src: "/images/trial-1.jpg",
    alt: "英创起点校区品牌墙近景",
  },
  {
    src: "/images/trial-2.jpg",
    alt: "英创起点校区接待区与品牌墙",
  },
  {
    src: "/images/trial-3.jpg",
    alt: "英创起点校区外景",
  },
  {
    src: "/images/trial-4.jpg",
    alt: "试听教学资料与课堂道具",
  },
];

export default function TrialPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Trial Experience</p>
        <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">英创起点试听预约</h1>
        <p className="max-w-3xl text-base text-white/70">开拓视野，看见世界，寻求真相，破除谎言，洞悉所有，热爱生活</p>
        <p className="inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
          暂无法通过线上预约，请联系老师进行试听。
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white">试听流程图</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {trialSteps.map((step, index) => (
            <div
              key={step}
              className="group relative rounded-2xl border border-white/10 bg-deepSpace/40 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_0_1px_rgba(37,217,210,0.25)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent/90">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold text-white/90">{step}</p>
              {index < trialSteps.length - 1 && (
                <span className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-accent/70 md:block">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">联系方式</h2>
          <dl className="mt-4 space-y-3 text-white/75">
            <div className="flex flex-col gap-1 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm text-white/55">电话</dt>
              <dd className="text-base font-semibold text-white">+86 15750091643</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm text-white/55">老师备注</dt>
              <dd className="text-base font-semibold text-white">杨老师</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <dt className="text-sm text-white/55">地址</dt>
              <dd className="text-base font-semibold text-white sm:max-w-[70%] sm:text-right">蒙自市吉庆路龙泰花园D栋英创起点</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-xl font-bold text-white">试听说明</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/75 sm:text-base">
            <li>▹ 试听时长：约 30-40 分钟（含课后沟通）。</li>
            <li>▹ 适龄建议：3–12 岁均可按水平分组试听。</li>
            <li>▹ 到校建议：提前 5 分钟签到即可，便于老师做基础评估。</li>
            <li>▹ 课后输出：提供课堂观察反馈与下一步学习建议。</li>
          </ul>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-xl font-bold text-white">扫码联系</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-deepSpace/40 p-4 transition duration-300 hover:border-accent/50">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">杨老师微信</h3>
            <div className="mx-auto w-full max-w-[220px] rounded-2xl border border-white/20 bg-white/95 p-2 shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-105">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200">
                <Image src={teacherQr} alt="杨老师微信二维码" fill className="object-contain" sizes="220px" />
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-deepSpace/40 p-4 transition duration-300 hover:border-accent/50">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">机构抖音二维码</h3>
            <div className="mx-auto w-full max-w-[220px] rounded-2xl border border-white/20 bg-white/95 p-2 shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition duration-300 hover:scale-105">
              <div className="relative aspect-square w-full overflow-hidden rounded-full border border-slate-200">
                <Image src={douyinQr} alt="机构抖音二维码" fill className="object-contain" sizes="220px" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">试听学习图片展示</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {trialPhotos.map((photo) => (
            <article
              key={photo.src}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-72 w-full overflow-hidden sm:h-80">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
