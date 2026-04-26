# 英创起点官网（Mission Control）

Next.js App Router + Tailwind CSS + Framer Motion + Zod。数据驱动展示页，面向家长传递专业、透明、未来感的品牌体验。

## 本地开发

```bash
cd yingchuang-site
npm install
npm run dev
```

默认端口 `3001`（避免与仓库根目录 Vite 项目冲突）。浏览器访问 `http://localhost:3001`。

## 构建与预览

```bash
npm run build
npm run start
```

## 修改内容（老师自助）

所有展示数据集中在 [`public/institution_data.json`](public/institution_data.json)。

- **品牌与首屏**：`brand` 字段（名称、Slogan、Hero 图 URL、预约链接）。
- **实时指标**：`liveStats`（支持数字或字符串，如 `1:6`）。
- **首页四卡**：`navCards`（标题、副标题、链接、角标）。
- **收费**：`pricing.plans` 与 `refundPolicy*`。
- **课表**：`schedule.windows` 与 `schedule.sessions`（`dayOfWeek` 使用 `0=周日 … 6=周六`，`startMinutes`/`endMinutes` 为从 00:00 起的分钟数）。
- **班级**：`classes`、`teachers`（通过 `teacherId` 关联）。
- **教材 / 图库**：`materials`、`gallery`。

保存后刷新页面即可看到更新（开发模式下无服务端缓存）。

## 数据校验

`src/lib/institution-schema.ts` 使用 Zod 描述 JSON 结构。若字段缺失或类型错误，`npm run build` 会在解析数据时失败并提示，避免线上展示半页空白。

## SEO 与站点 URL

复制 `.env.example` 为 `.env.local`，设置 `NEXT_PUBLIC_SITE_URL` 为正式域名，用于 `metadataBase` 与结构化数据中的 `url` 字段。

## 部署提示

- 推荐使用 Vercel / Netlify / 任意支持 Node 的托管运行 `next start`，或 `next build` 后的 standalone 输出。
- 若仅静态导出（`output: "export"`），需自行评估：本项目使用 `fs` 读取 `public/institution_data.json`，默认 **不建议** 改为纯静态导出，除非改为 `import` JSON 或构建时注入。
- 远程图片域名需在 `next.config.mjs` 的 `images.remotePatterns` 中白名单；更换图床时同步更新配置。

## 与仓库内 Vite 项目的关系

本目录为独立子项目，不覆盖根目录 `lingoflow`（Vite 背单词应用）。两者可同时存在，分别 `npm run dev`。
