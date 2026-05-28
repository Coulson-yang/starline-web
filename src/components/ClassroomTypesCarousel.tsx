"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ClassroomType = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  teachingMode: string;
  content: string;
  vocab: string;
  highlight: string;
};

const classroomTypes: ClassroomType[] = [
  {
    id: "vocab-grammar",
    title: "词汇语法课",
    subtitle: "Vocabulary & Grammar Mastery",
    imageUrl: "/images/classroom-type-1.jpg",
    teachingMode: "中教讲解核心逻辑 + 外教实战场景演练。",
    content:
      "拒绝死记硬背。中教通过思维导图拆解语法结构；外教通过即兴对话，将抽象规则代入真实生活语境。",
    vocab: "采用语块学习法，不只记单词本身，更记常用搭配和地道用法。",
    highlight: "双向闭环：中教确保“听懂了”，外教确保“会用了”，解决“懂语法、不会说”的痛点。",
  },
  {
    id: "diy",
    title: "DIY手工课",
    subtitle: "Creative Hands-on Workshop",
    imageUrl: "/images/classroom-type-2.jpg",
    teachingMode: "全英沉浸式环境，外教示范演示 + 中教辅助协作。",
    content: "涵盖乐高搭建、绘画、黏土、科学小实验等，在完成作品的过程中自然习得语言。",
    vocab: "聚焦动作指令与性状词，在多感官刺激下强化记忆。",
    highlight: "非对称输入：孩子在专注做手工时，大脑更放松，英语成为完成任务的工具。",
  },
  {
    id: "festival",
    title: "节日主题课",
    subtitle: "Cultural Festive Gala",
    imageUrl: "/images/classroom-type-3.jpg",
    teachingMode: "沉浸式文化派对，中外教共同策划大型主题情境。",
    content: "还原万圣节、圣诞节、复活节等节日场景，通过故事、游戏、美食体验理解文化底蕴。",
    vocab: "拓展文化专有名词及社交礼仪表达，提升跨文化交际能力。",
    highlight: "全球视野：不仅学语言，更培养“世界公民”素质的跨文化理解力。",
  },
  {
    id: "role-play",
    title: "角色扮演课",
    subtitle: "Role-Play Theater",
    imageUrl: "/images/classroom-type-4.jpg",
    teachingMode: "剧本式情景教学：外教担任导演/对手戏演员，中教担任剧本顾问。",
    content: "模拟餐厅点餐、机场值机、医院就诊或童话剧，让孩子在表演中释放天性。",
    vocab: "掌握高频生活场景句式及情绪表达词汇，强调语音语调自然流利。",
    highlight: "零压力表达：通过角色代入，消除开口羞怯感，建立表达自信。",
  },
  {
    id: "parent-open-day",
    title: "家长公开课",
    subtitle: "Parental Open Day",
    imageUrl: "/images/classroom-type-5.jpg",
    teachingMode: "亲子互动观摩课，家长受邀进入课堂，与孩子共同参与任务。",
    content: "阶段性学习成果展示，包括小组辩论、英文演讲与师生互动汇报。",
    vocab: "集中展示学期核心词汇库，让家长直观看到语言储备和输出能力。",
    highlight: "教学透明化：让家长深度理解1:1双教模式，共同构建家校共育。",
  },
];

export function ClassroomTypesCarousel() {
  const [index, setIndex] = useState(0);
  const maxIndex = classroomTypes.length - 1;
  const current = useMemo(() => classroomTypes[index] ?? classroomTypes[0], [index]);

  return (
    <section className="relative isolate h-screen w-full overflow-hidden">
      <div className="relative h-full w-full md:hidden">
        <div className="-mx-1 flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-1">
          {classroomTypes.map((item) => (
            <article key={`mobile-${item.id}`} className="relative h-[88vh] w-[94%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10">
              <Image src={item.imageUrl} alt={item.title} fill className="scale-[1.06] object-cover object-center" sizes="94vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#01050f]/45 via-[#020712]/28 via-45% to-[#01050f]/42" />
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[86vw] w-[86vw] max-h-[620px] max-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#020712]/78 blur-3xl" />
                <div className="relative z-10 max-w-2xl space-y-3">
                  <h3 className="text-4xl font-black tracking-[0.04em] text-white">{item.title}</h3>
                  <p className="text-sm font-semibold text-accent">{item.subtitle}</p>
                  <p className="text-sm leading-7 text-white/80">{item.teachingMode}</p>
                  <p className="text-sm leading-7 text-white/80">{item.content}</p>
                  <p className="text-sm leading-7 text-white/80">{item.vocab}</p>
                  <p className="text-sm leading-7 text-white/90">{item.highlight}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[11px] text-white/55">左右滑动查看更多课堂类型</p>
      </div>

      <div className="relative hidden h-full w-full md:block">
        <Image src={current.imageUrl} alt={current.title} fill className="scale-[1.06] object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020712]/72 via-[#071225]/50 to-[#020712]/75" />

        <button
          type="button"
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          disabled={index === 0}
          className="absolute left-6 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-deepSpace/55 text-3xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="查看上一种课堂类型"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setIndex((prev) => Math.min(maxIndex, prev + 1))}
          disabled={index >= maxIndex}
          className="absolute right-6 top-1/2 z-20 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-deepSpace/55 text-3xl text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="查看下一种课堂类型"
        >
          ›
        </button>

        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[68vw] w-[68vw] max-h-[640px] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#020712]/60 blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <h2 className="text-5xl font-black tracking-[0.05em] text-white">{current.title}</h2>
            <p className="text-lg font-semibold text-accent">{current.subtitle}</p>
            <p className="text-base leading-8 text-white/82">{current.teachingMode}</p>
            <p className="text-base leading-8 text-white/82">{current.content}</p>
            <p className="text-base leading-8 text-white/82">{current.vocab}</p>
            <p className="text-base leading-8 text-white/92">{current.highlight}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
