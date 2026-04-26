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
  const [start, setStart] = useState(0);
  const maxStart = Math.max(0, classroomTypes.length - 2);
  const visible = useMemo(() => classroomTypes.slice(start, start + 2), [start]);

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">CLASSROOM TYPES</p>
          <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">课堂类型</h2>
          <p className="max-w-3xl text-sm text-white/65">展示英创起点丰富课堂形态，当前每次展示两种课堂，可通过左右按钮切换预览。</p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => setStart((prev) => Math.max(0, prev - 1))}
            disabled={start === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="查看上一组课堂类型"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setStart((prev) => Math.min(maxStart, prev + 1))}
            disabled={start >= maxStart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-lg text-white transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="查看下一组课堂类型"
          >
            →
          </button>
        </div>
      </div>

      <div className="relative mt-6 md:hidden">
        <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1">
          {classroomTypes.map((item) => (
            <article key={`mobile-${item.id}`} className="w-[88%] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="relative h-64 w-full">
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="text-2xl font-black text-white">{item.title}</h3>
                <p className="text-sm font-semibold text-accent">{item.subtitle}</p>
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-white">上课方式：</span>
                  {item.teachingMode}
                </p>
                <p className="text-sm text-white/75">
                  <span className="font-semibold text-white">课堂内容：</span>
                  {item.content}
                </p>
                <p className="text-sm text-white/75">
                  <span className="font-semibold text-white">词汇学习：</span>
                  {item.vocab}
                </p>
                <p className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-white/90">
                  <span className="font-semibold text-accent">核心亮点：</span>
                  {item.highlight}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-deepSpace/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-deepSpace/90 to-transparent" />
        <p className="mt-3 text-center text-[11px] text-white/45">左右滑动查看更多</p>
      </div>

      <div className="mt-6 hidden gap-4 md:grid md:grid-cols-2">
        {visible.map((item) => (
          <article key={`desktop-${item.id}`} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="relative h-64 w-full">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="space-y-3 p-6">
              <h3 className="text-2xl font-black text-white">{item.title}</h3>
              <p className="text-sm font-semibold text-accent">{item.subtitle}</p>
              <p className="text-sm text-white/80">
                <span className="font-semibold text-white">上课方式：</span>
                {item.teachingMode}
              </p>
              <p className="text-sm text-white/75">
                <span className="font-semibold text-white">课堂内容：</span>
                {item.content}
              </p>
              <p className="text-sm text-white/75">
                <span className="font-semibold text-white">词汇学习：</span>
                {item.vocab}
              </p>
              <p className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-white/90">
                <span className="font-semibold text-accent">核心亮点：</span>
                {item.highlight}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
