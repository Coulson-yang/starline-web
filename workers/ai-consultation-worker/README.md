# 英创起点官网 AI 咨询 Worker

这个目录是方案二的安全中间层。静态官网前端调用 Cloudflare Worker，Worker 再调用 DeepSeek。DeepSeek API Key 只放在 Cloudflare 后台，不会暴露给浏览器。

## 部署步骤

1. 安装 Cloudflare Wrangler：

```powershell
npm install -g wrangler
```

2. 登录 Cloudflare：

```powershell
wrangler login
```

3. 复制配置文件：

```powershell
cd workers\ai-consultation-worker
copy wrangler.toml.example wrangler.toml
```

4. 修改 `wrangler.toml`：

```toml
ALLOWED_ORIGIN = "https://你的官网域名"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-v4-pro"
```

5. 添加 DeepSeek Key：

```powershell
wrangler secret put DEEPSEEK_API_KEY
```

6. 部署：

```powershell
wrangler deploy
```

部署成功后会得到一个 Worker 地址，例如：

```text
https://yingchuang-ai-consultation.xxxx.workers.dev
```

把这个地址配置到官网构建环境：

```env
NEXT_PUBLIC_AI_ASSISTANT_ENDPOINT=https://yingchuang-ai-consultation.xxxx.workers.dev
```

然后重新构建并发布静态官网。

## 注意

- 不要把 DeepSeek API Key 写进官网代码。
- 前台 AI 只适合回答基础咨询问题。
- 价格、排期、地址、优惠、剩余名额等信息，以老师或教务确认为准。
- 投诉、退款、负面情绪等问题应转人工。
