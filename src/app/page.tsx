import Image from "next/image";
import { MissionNavCard } from "@/components/MissionNavCard";
import { TelemetryStat } from "@/components/TelemetryStat";
import { GhostButton } from "@/components/ui/GhostButton";
import { HomePreviewGallery } from "@/components/HomePreviewGallery";
import { ClassroomTypesCarousel } from "@/components/ClassroomTypesCarousel";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import { getInstitutionData } from "@/lib/get-institution-data";

export default async function HomePage() {
  const data = await getInstitutionData();

  return (
    <div className="pb-16">
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <HeroVideoBackground
          poster="/images/hero-poster.jpg"
          videos={[
            { src: "/videos/hero-1.mp4" },
            { src: "/videos/hero-2.mp4" },
            { src: "/videos/hero-3.mp4" },
            { src: "/videos/hero-4.mp4" },
          ]}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deepSpace/40 via-deepSpace/70 to-deepSpace" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-24 sm:pt-28 lg:pt-32">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">英创起点 Start Line.</p>
            <h1 className="text-4xl font-black leading-tight tracking-tighter text-white sm:text-5xl lg:text-6xl">{data.brand.tagline}</h1>
            <p className="text-lg text-white/80">专注3-16岁英语启蒙，搭建语言体系，开发语言思维，让孩子自信开口！</p>
            <div className="flex flex-wrap gap-3">
              <GhostButton href={data.brand.trialCtaHref} variant="accent">
                {data.brand.trialCtaLabel}
              </GhostButton>
              <GhostButton href="/investment" variant="white">
                了解方案
              </GhostButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-6xl px-4 sm:-mt-16">
        <div className="relative">
          <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
            {data.liveStats.map((stat) => (
              <div key={stat.id} className="w-[90%] shrink-0 snap-start sm:w-auto sm:shrink sm:snap-none">
                <TelemetryStat label={stat.label} value={stat.value} suffix={stat.suffix} hint={stat.hint} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-deepSpace/90 to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-deepSpace/90 to-transparent sm:hidden" />
        </div>
        <p className="mt-3 text-center text-[11px] text-white/45 sm:hidden">左右滑动切换卡片</p>
      </section>

      <HomePreviewGallery items={data.gallery} />

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">ABOUT START LINE</p>
          <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">关于英创起点</h2>
        </div>

        <div className="relative mt-6">
          <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 [&>article]:w-[92%] [&>article]:shrink-0 [&>article]:snap-start md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:[&>article]:w-auto md:[&>article]:shrink lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <div className="mb-4 inline-flex rounded-2xl border border-white/15 bg-deepSpace/70 p-3 text-accent">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M24 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M18 3.1a4 4 0 0 1 0 7.8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">外教+中教 双师授课</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">我们采用“外教搭中教”一起上课的模式。外教营造沉浸式英语环境，培养语感；中教辅助理解，确保知识吸收。</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <div className="mb-4 inline-flex rounded-2xl border border-white/15 bg-deepSpace/70 p-3 text-accent">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3c-3.8 0-7 2.9-7 6.5 0 2 1 3.7 2.5 4.9V18l3.2-1.9c.4.1.9.2 1.3.2 3.8 0 7-2.9 7-6.5S15.8 3 12 3Z" />
                <path d="M9 9.2c.6-1 1.7-1.7 3-1.7 1.9 0 3.4 1.3 3.4 3 0 2.2-2.4 2.7-2.4 4" />
                <circle cx="13" cy="17.3" r=".7" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">开发语言思维</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">注重培养兴趣，不仅提高听说读写能力，更致力于搭建完整的语言体系，开发孩子的英语逻辑思维。</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <div className="mb-4 inline-flex rounded-2xl border border-white/15 bg-deepSpace/70 p-3 text-accent">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
                <path d="M4 6h11" />
                <path d="M12 3v16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">剑桥原版教材</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">使用剑桥原版教材 Kid&apos;s Box 和 Guess What!，内容生动有趣，接轨国际标准，拓宽国际视野。</p>
          </article>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-deepSpace/90 to-transparent md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-deepSpace/90 to-transparent md:hidden" />
          <p className="mt-3 text-center text-[11px] text-white/45 md:hidden">左右滑动查看更多</p>
        </div>
      </section>

      <ClassroomTypesCarousel />

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">ORIGINAL MATERIALS · SCIENTIFIC FRAMEWORK</p>
          <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">原版教材 · 科学体系</h2>
        </div>

        <div className="mt-6 -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 [&>article]:w-[92%] [&>article]:shrink-0 [&>article]:snap-start md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:[&>article]:w-auto md:[&>article]:shrink">
          <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-6 sm:text-base">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">剑桥原版教材: Kid&apos;s Box</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] sm:max-w-[300px]">
                <Image src="/images/material-kids-box.jpg" alt="Kid&apos;s Box 教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">剑桥大学出版社专为非英语国家儿童编写。通过生动的故事、歌曲和游戏激发兴趣，全面覆盖剑桥少儿英语(YLE)词汇与语法。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>全方位技能闭环：独有的单词循环体系，确保每一个核心词汇都在不同语境中重复出现，形成长效记忆。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>趣味交互体验：配合丰富的多媒体互动资源，让课堂变成一场“英语派对”。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>适合人群：3-12岁，希望建立扎实听说读写基础、并有国际测评需求的学习者。</span>
              </li>
            </ul>

            <div className="mt-auto pt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">学习趣味性</span>
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">考试针对性</span>
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">基础夯实度</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-6 sm:text-base">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-2xl font-black tracking-tight text-white">剑桥原版教材: Guess What!</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
                <Image src="/images/material-guess-what.jpg" alt="Guess What! 教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">通过精美的摄影图片和引人入胜的话题（如 &ldquo;Why is the sky blue?&rdquo;）激发孩子的好奇心。采用CLIL教学法，在学习英语的同时探索科学、地理等学科知识。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>CLIL 学科融合：在英语课上聊生命周期、谈地球构造。让孩子在学习语言的同时，构建对世界的认知（Content and Language Integrated Learning）。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>批判性思维培养：每一单元都从“大问题”出发，引导孩子观察、思考并表达观点，培养解决问题的能力。</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </span>
                <span>适合人群：6-15岁，好奇心旺盛、希望跳出语言本身、通过英语学习多学科知识的“探索者”。</span>
              </li>
            </ul>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">视野广度</span>
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">学科融合</span>
              <span className="flex items-center justify-center rounded-xl border border-white/15 bg-deepSpace/70 px-4 py-2.5 text-sm font-semibold text-white/85">思维深度</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-2xl font-black tracking-tight text-white">剑桥原版教材: Power Up</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
                <Image src="/images/material-powerup.jpg" alt="Power Up 教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">由剑桥大学出版社精心打造，Power Up 将语言学习、生活技能和考试考评融合在同一体系中，不仅提升英语能力，更关注孩子的21世纪核心素养。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>全人教育理念：每单元含生活技能板块，训练问题解决与情绪管理。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>考教结合：对接 YLE / KET / PET，课堂即备考。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>跨学科探索：CLIL 内容覆盖科学、艺术、地理，拓宽视野。</span></li>
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">剑桥系</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">综合素质</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">考证必备</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">跨学科学习</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-2xl font-black tracking-tight text-white">剑桥原版教材: ThinkQuick</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
                <Image src="/images/material-thinkquick.jpg" alt="ThinkQuick 教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">ThinkQuick 面向青少年高阶学习，打破背诵式学习，通过社会责任、价值观、心理学等话题驱动语言习得，被誉为“最锻炼大脑”的英语教材之一。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>批判性思维：大量 Think! 环节，引导形成独立观点。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>青少年契合度高：社交媒体、自我身份、未来科技等话题激发表达欲。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>语法词汇挑战度高：快速提升阅读深度与写作逻辑。</span></li>
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">青少年首选</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">批判性思维</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">高阶英语</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">逻辑思维培养</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-2xl font-black tracking-tight text-white">牛津原版教材: 牛津自拼世界</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
                <Image src="/images/material-opw.jpg" alt="牛津自拼世界教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">作为全球最受推崇的拼读教材之一，牛津拼读世界（OPW）不仅是教孩子发音，更是通过多感官的互动方式，构建起字母与语音之间的桥梁。它通过循序渐进的5个级别，涵盖了从26个字母到复杂元音组合的所有核心规则。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>科学螺旋上升：从单音到组合音，难度切分极细，确保孩子无痛进阶。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>多维互动学习：结合动听的歌曲、韵律诗和趣味游戏，让枯燥的拼读充满生命力。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>阅读能力迁移：不止于发音，教材配套大量拼读读本，直接助力早期阅读。</span></li>
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">零基础启蒙</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">自然拼读权威</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">见词能读</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">牛津原版</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
            <span className="mb-4 block h-1.5 w-12 rounded-full bg-accent" aria-hidden="true" />
            <h3 className="text-2xl font-black tracking-tight text-white">剑桥雅思</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px]">
                <Image src="/images/material-cambridge-ielts.jpg" alt="剑桥雅思教材封面" fill className="object-contain" sizes="(max-width: 768px) 70vw, 300px" />
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">由剑桥大学英语考评部出品，这是全球雅思考生人手一套的官方真题。它不仅是练习题，更是雅思考试命题趋势的真实缩影。</p>

            <p className="mt-4 text-sm font-semibold text-white/85">核心亮点：</p>
            <ul className="mt-2 space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>官方命题逻辑：100%还原真实考题的语料库与出题思路，让你在练习中产生“肌肉记忆”。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>评分标准对标：附带官方权威的口语与写作评分范文，直观揭秘考官眼中的高分逻辑。</span></li>
              <li className="flex gap-2"><span className="mt-0.5 text-accent">▹</span><span>模考压力测试：严格按照1:1的时间比例进行实战演练，帮助考生精准把控考场节奏，告别临场慌乱。</span></li>
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">雅思备考</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">官方真题</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">#考研出国</span>
              <span className="rounded-xl border border-white/15 bg-deepSpace/70 px-3 py-2 text-center text-xs font-semibold text-white/85">#提分神器</span>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">AGENCY DETAILS</p>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">课堂动态</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/65">四张巨幅卡片对应收费、排期、舰队与乘员技术栈，移动端单列浏览同样清晰。</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data.navCards.map((card, index) => (
            <MissionNavCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              href={card.href}
              metric={card.metric}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
