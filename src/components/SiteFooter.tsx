export function SiteFooter({ brandName }: { brandName: string }) {
  return (
    <footer className="border-t border-white/10 bg-black/30 py-10 text-sm text-white/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold tracking-tight text-white/70">{brandName} · 英创起点官网 v1.0</p>
        <p className="text-xs sm:text-sm">数据来自 institution_data.json · 展示信息以签约与教务确认为准</p>
      </div>
    </footer>
  );
}
