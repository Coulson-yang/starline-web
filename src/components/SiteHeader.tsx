import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", zh: "首页", en: "Home" },
  { href: "/investment", zh: "课程收费", en: "Pricing" },
  { href: "/manifest", zh: "课表时间", en: "Schedule" },
  { href: "/fleet", zh: "班级信息", en: "Class Info" },
  { href: "/crew-tech", zh: "师资及校区风采", en: "Faculty & Campus" },
  { href: "/attendance", zh: "学生考勤", en: "Attendance" },
];

export function SiteHeader({ brandName }: { brandName: string; trialHref: string; trialLabel: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-deepSpace/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-4">
        <div className="flex items-center justify-center sm:justify-start">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white sm:gap-3 sm:text-3xl">
            <span className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white/5 sm:h-11 sm:w-11">
              <Image src="/images/brand-logo.png" alt="英创起点品牌Logo" fill className="object-cover" sizes="44px" />
            </span>
            <span>
              {brandName}
              <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent sm:ml-3 sm:text-base">Start Line.</span>
            </span>
          </Link>
        </div>
        <nav className="flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap text-white/70 sm:ml-auto sm:w-auto sm:justify-end sm:gap-3" aria-label="主导航">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-xl px-2 py-1 text-center transition hover:bg-white/5 hover:text-white sm:px-3 sm:py-1.5 sm:text-right">
              <span className="block text-xs font-semibold leading-none text-white sm:text-sm">{item.zh}</span>
              <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.12em] text-white/55 sm:block">{item.en}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
