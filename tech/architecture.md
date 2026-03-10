# AIPPT.cc 技术架构详解

> 本文档面向希望深入理解、二次开发或贡献代码的开发者，全面讲解 AIPPT.cc 的技术实现原理。

---

## 目录

1. [整体架构概览](#1-整体架构概览)
2. [目录结构说明](#2-目录结构说明)
3. [AI 层架构](#3-ai-层架构)
4. [幻灯片编辑引擎](#4-幻灯片编辑引擎)
5. [Agent 系统](#5-agent-系统)
6. [数据流与状态管理](#6-数据流与状态管理)
7. [认证系统](#7-认证系统)
8. [国际化（i18n）](#8-国际化i18n)
9. [导出模块](#9-导出模块)
10. [自动保存机制](#10-自动保存机制)
11. [性能优化策略](#11-性能优化策略)
12. [二次开发指南](#12-二次开发指南)

---

## 1. 整体架构概览

AIPPT.cc 是一个纯前端应用，核心设计目标是：

- **零后端依赖可用**：用户只需填写 LLM API Key 即可完整使用
- **多 LLM 兼容**：所有主流 OpenAI-compatible 接口统一抽象
- **模块化可扩展**：新增 LLM 提供商或 AI 技能只需增加配置

### 整体分层

```
┌─────────────────────────────────────────────────────┐
│                      Views Layer                     │
│  login.vue  │  home.vue  │  ai-create.vue  │  slide  │
├─────────────────────────────────────────────────────┤
│                  Composables Layer                   │
│  useAIGeneration  │  useSlideOperations  │  useChat  │
│  useAutoSave      │  useThemeManager     │  ...      │
├─────────────────────────────────────────────────────┤
│                    Agent Layer                       │
│  AgentOrchestrator  │  ContextManager  │  Skills    │
├──────────────────────────┬──────────────────────────┤
│        AI Util Layer     │    API Client Layer       │
│  streamGenerate          │  authApi / documentApi    │
│  modelRouter             │  presentationApi / aiApi  │
│  providers               │  commentApi               │
└──────────────────────────┴──────────────────────────┘
```

---

## 2. 目录结构说明

```
src/
├── agents/                # AI Agent 系统（核心/记忆/技能三层）
│   ├── core/
│   │   ├── AgentOrchestrator.ts   # Agent 总协调器
│   │   └── SkillRouter.ts         # 技能路由
│   ├── memory/
│   │   └── ContextManager.ts      # 对话历史 + 幻灯片上下文
│   ├── skills/
│   │   ├── SkillRegistry.ts       # 技能注册表
│   │   └── implementations/       # 各技能实现
│   └── index.ts                   # 统一对外 API
│
├── api/                   # HTTP 客户端层
│   ├── auth.ts            # 注册/登录/GitHub OAuth
│   ├── document.ts        # 文档 CRUD + 权限管理
│   ├── presentation.ts    # 演示文稿接口
│   ├── ai.ts              # AI 试用 + 图像生成
│   └── response.ts        # 响应格式解包工具
│
├── composables/           # Vue 3 Composition API 逻辑复用
│   ├── useAIGeneration.ts       # AI 内容流式生成
│   ├── useAISuggestionApplier.ts # AI 建议应用
│   ├── useChatIntegration.ts    # AI 聊天面板集成
│   ├── useDocumentIntegration.ts # 文档集成
│   ├── useSlideAutoSave.ts      # 防抖自动保存
│   ├── useSlideOperations.ts    # 幻灯片增删改查
│   ├── useThemeManager.ts       # 主题管理
│   ├── useLayoutApplication.ts  # 布局应用
│   └── ...
│
├── utils/
│   ├── ai/                # LLM 接入层
│   │   ├── config.ts      # AI 设置存取（localStorage）
│   │   ├── providers.ts   # 所有 LLM 提供商配置
│   │   ├── modelRouter.ts # 智能模型路由
│   │   ├── openaiStream.ts # OpenAI SSE 流式解析
│   │   └── index.ts       # streamGenerate 统一入口
│   ├── export/            # PDF/PPTX/PNG 导出
│   ├── import/            # PPTX/Markdown 导入
│   └── slide/             # 幻灯片渲染工具
│
├── views/
│   ├── login.vue          # 登录/注册页（含 Demo 一键体验）
│   ├── home.vue           # 工作台首页
│   ├── ai-create.vue      # AI 创建演示文稿
│   └── slide-page/
│       └── slide-page.vue # 幻灯片编辑器主页面（10 万行级）
│
└── locales/               # i18n（8 种语言）
```

---

## 3. AI 层架构

### 3.1 LLM 提供商抽象

所有 LLM 提供商通过统一的 `ProviderConfig` 接口描述，位于 `src/utils/ai/providers.ts`：

```typescript
export interface ProviderConfig {
  key: ProviderKey          // 唯一标识
  label: string             // 展示名称
  baseUrl: string           // OpenAI-compatible base URL
  models: { label: string; value: string }[]
  buildHeaders?: (apiKey: string) => Record<string, string>
}
```

支持的提供商及其 baseUrl：

| 提供商 | baseUrl |
|-------|---------|
| DeepSeek | `https://api.deepseek.com/v1` |
| OpenAI | `https://api.openai.com/v1` |
| Claude | `https://api.anthropic.com/v1` |
| Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| Kimi | `https://api.moonshot.cn/v1` |
| Qwen | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| GLM | `https://open.bigmodel.cn/api/paas/v4` |
| Doubao | `https://ark.cn-beijing.volces.com/api/v3` |
| Grok | `https://api.x.ai/v1` |
| MiniMax | `https://api.minimaxi.com/v1` |
| Custom | 用户自定义 |

**新增提供商只需在 `PROVIDERS` 对象中添加一条配置即可**，无需修改任何其他代码。

### 3.2 流式生成核心：`streamGenerate`

`src/utils/ai/index.ts` 导出的 `streamGenerate` 是整个 AI 调用的统一入口：

```typescript
streamGenerate(
  userPrompt: string,
  systemPrompt?: string,
  handler?: StreamHandler,   // { onDelta, onDone, onError }
  controller?: AbortController,
  options?: {
    provider?: ProviderKey    // 强制指定提供商
    model?: string            // 强制指定模型
    taskContext?: {           // 自动路由上下文
      isChat?: boolean
      slideCount?: number
      hasDocument?: boolean
    }
  }
): AbortController
```

**执行流程：**

```
streamGenerate(prompt)
  │
  ├─ 读取 localStorage AI 设置
  ├─ 判断是否有 API Key
  │   ├─ 有 Key → 直接调 Provider API（纯前端，零后端）
  │   └─ 无 Key → 调 /ai/trial/stream 后端兜底
  │
  ├─ 智能模型路由（analyzeTaskType）
  └─ streamOpenAI() → SSE 解析 → onDelta 回调
```

### 3.3 SSE 流式解析

`src/utils/ai/openaiStream.ts` 实现标准 OpenAI SSE 协议解析：

```typescript
// 使用 fetch + ReadableStream，兼容所有现代浏览器
const res = await fetch(url, { method: 'POST', body: JSON.stringify({stream: true}), signal })
const reader = res.body.getReader()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  // 解析 "data: {...}\n\n" 格式
  // 提取 choices[0].delta.content
  onDelta(delta)
}
```

支持 `AbortController` 中断，用户可随时停止生成。

### 3.4 智能模型路由

`src/utils/ai/modelRouter.ts` 根据任务类型自动选择最优模型：

```
用户 Prompt
    │
    ▼
analyzeTaskType(prompt, context)
    │
    ├── 包含 "report/analysis" → INDUSTRY_REPORT → DeepSeek Reasoner
    ├── 包含 "pdf/document" → DOCUMENT_PARSE → DeepSeek Chat
    ├── 幻灯片数 > 8 → LONG_FORM_WRITING → DeepSeek Chat
    ├── 包含 "layout/align" → LAYOUT_ADJUSTMENT → MiniMax Lightning
    ├── isChat: true → REAL_TIME_CHAT → MiniMax Lightning
    └── 默认短 Prompt → QUICK_EDIT → MiniMax Lightning
```

**设计原则**：复杂推理任务用 DeepSeek（准确度优先），实时交互任务用 MiniMax Lightning（速度优先）。

### 3.5 API Key 优先级

```
1. settings.apiKeys[provider]  ← 用户在设置面板配置的 Provider 专用 Key
2. import.meta.env.VITE_XXX_API_KEY  ← 环境变量（部署时配置）
3. settings.apiKey  ← 旧版通用 Key（向后兼容）
4. 无 Key → 后端 trial 兜底
```

---

## 4. 幻灯片编辑引擎

### 4.1 数据格式

幻灯片内容以 **Markdown** 字符串存储，使用 `---` 分隔每一页：

```markdown
---
theme: default
---

# 标题幻灯片
### 副标题

---

## 内容页

- 要点一
- 要点二

---

## 图表页

<!-- CHART:bar -->
{"title":{"text":"销售数据"},"xAxis":{"data":["Q1","Q2","Q3"]},"series":[...]}
```

`<!-- CHART:type -->` 是图表嵌入标记，紧跟一行 ECharts JSON 配置。

### 4.2 Markdown → ParsedSlide

`src/composables/useSlideOperations.ts` 中的 `parsedSlides` 是核心计算属性：

```typescript
const parsedSlides = computed(() => {
  return markdownContent.value
    .split('---')
    .filter(s => s.trim())
    .map(content => {
      const chartMarker = content.match(/<!-- CHART:(\w+) -->/)
      if (chartMarker) {
        // 提取 JSON → type: 'chart'
        return { type: 'chart', option: chartOption }
      }
      return { type: 'markdown', content }
    })
})
```

### 4.3 Canvas 渲染引擎

幻灯片编辑器基于 **Konva.js** 构建：

- `vue-konva` 将 Konva 对象包装为 Vue 组件
- 每个幻灯片元素（文本框/图片/形状）是一个 Konva `Group`
- 拖拽、缩放、旋转通过 Konva `Transformer` 实现
- 多选操作通过 Ctrl+Click 更新 `selectedIds` 数组

### 4.4 组件系统

编辑器支持的组件类型及对应渲染器：

| 组件类型 | 渲染方式 |
|---------|---------|
| 文本框 | Konva.Text + Tiptap 富文本 |
| 图片 | Konva.Image + html-to-image |
| ECharts 图表 | `<EChartsChart>` 组件 |
| 思维导图 | Mind Elixir + Konva.foreignObject |
| 形状/SVG | Konva.Path |
| 代码块 | highlight.js / Shiki |
| 数学公式 | KaTeX |
| 二维码 | qrcode.vue |
| 表格 | 自定义 HTML Table |

### 4.5 主题系统

`src/composables/useThemeManager.ts` 管理全局主题：

- 主题以 CSS 变量注入到 `:root`
- 支持亮色/暗色模式切换
- 颜色面板实时预览 + 应用

---

## 5. Agent 系统

### 5.1 三层架构

```
AgentOrchestrator (core/)
    │  接收用户请求，协调各层
    │
    ├── ContextManager (memory/)
    │      存储对话历史 + 当前幻灯片上下文
    │
    └── SkillRegistry (skills/)
           注册并管理所有 AI 技能
               ├── TextOptimizationSkill
               ├── ImageGenerationSkill
               ├── ChartGenerationSkill
               ├── LayoutOptimizationSkill
               └── IntelligentLayoutSkill
```

### 5.2 请求处理流程

```typescript
// 1. 用户在 ChatPanel 输入
const result = await agentOrchestrator.handleUserRequest(
  '优化当前幻灯片的标题',
  {
    slideContent: currentSlide.raw,
    visualData: { components: [...] },
    conversationHistory: contextManager.getHistory()
  }
)

// 2. SkillRouter 匹配最合适的 Skill
// 3. 执行 Skill.execute(params)
// 4. 返回结构化结果（文本/JSON Patch/图片 URL）
// 5. AISuggestionApplier 将结果应用到幻灯片
```

### 5.3 添加新技能

在 `src/agents/skills/implementations/` 创建新文件：

```typescript
export class VideoGenerationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'video-generation',
    name: 'Video Generation',
    keywords: ['视频', 'video', '动画', 'animation'],
    description: 'AI 生成演示视频',
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    // 调用视频生成 API
    return { type: 'video', url: '...' }
  }
}
```

在 `AgentOrchestrator.ts` 的 `registerSkills()` 中注册即可。

---

## 6. 数据流与状态管理

### 6.1 幻灯片数据流

```
用户编辑
    │
    ▼
markdownContent (ref<string>)   ← 单一数据源
    │
    ├── parsedSlides (computed)  ← 派生数据，自动重计算
    ├── useSlideAutoSave         ← watch → debounce → API
    └── 渲染层                   ← ECharts / Markdown 渲染
```

### 6.2 认证状态

认证信息存储在 `localStorage`，无 Pinia store（轻量设计）：

```
localStorage:
├── jwt_token      # Bearer Token
├── uid            # 用户 ID（路由守卫用）
├── username       # 展示用
├── userRole       # 权限角色
└── userColor      # 头像颜色（随机生成）
```

### 6.3 AI 设置持久化

```typescript
// src/utils/ai/config.ts
const STORAGE_KEY = 'pxdoc_ai_settings'

// 写入
localStorage.setItem(STORAGE_KEY, JSON.stringify({
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKeys: { deepseek: 'sk-...' }
}))
```

---

## 7. 认证系统

### 7.1 支持的登录方式

| 方式 | 实现 |
|-----|------|
| 邮箱 + 密码 | `POST /api/auth/login` |
| 邮箱 + 验证码注册 | `POST /api/auth/register` |
| 激活码登录 | 同登录接口，email 字段传激活码 |
| GitHub OAuth | 跳转 GitHub → callback → `POST /api/auth/github/callback` |
| Demo 一键体验 | 前端直接设置 localStorage，无需后端 |

### 7.2 路由守卫

`src/router/index.js` 中的 `beforeEach` 守卫：

```javascript
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('uid')  // 轻量判断

  if (!isAuthenticated && to.meta.requiresAuth) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  next()
})
```

### 7.3 Token 刷新

Token 过期（401）时，`src/utils/req.ts` 的响应拦截器自动：
1. 清除所有 localStorage 认证信息
2. 跳转到登录页（携带原始路径作为 redirect 参数）

### 7.4 Demo 模式

Demo 登录逻辑（`src/views/login.vue`）：

```
点击「一键体验」
    │
    ▼
尝试 authApi.login(DEMO_ACCOUNT, DEMO_PASSWORD)
    │
    ├── 成功 → 正常 JWT 流程
    └── 失败（无后端）→ 生成本地 demo_xxx UID
               └── 直接进入首页（本地模式）
```

本地模式下，文档保存操作会因无后端而失败，但 AI 功能（使用个人 API Key）完全可用。

---

## 8. 国际化（i18n）

### 8.1 技术栈

- **vue-i18n 10** (Composition API 模式)
- **i18next 23**（部分场景）
- 8 种语言：zh, zh-Hant, en, ja, ko, id, th, vi

### 8.2 语言检测优先级

```javascript
// src/locales/index.js
function detectDefaultLocale() {
  // 1. localStorage 保存的用户偏好
  const saved = localStorage.getItem('pxdoc:locale')
  if (saved) return saved

  // 2. 浏览器语言
  const nav = navigator.language
  if (nav.startsWith('zh')) return nav.includes('tw') ? 'zh-Hant' : 'zh'
  // ...
}
```

### 8.3 翻译文件结构

```json
// src/locales/zh.json
{
  "common": { "loading": "加载中..." },
  "auth": {
    "demoLogin": "一键体验 Demo",
    "demoHint": "无需注册，直接体验全部核心功能"
  },
  "slide": {
    "home": { "workspace": "工作台" }
  }
}
```

### 8.4 在组件中使用

```typescript
// Composition API（推荐）
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
t('auth.demoLogin') // → "一键体验 Demo"

// 直接访问全局 i18n 实例（login.vue 中的用法）
import i18n from '@/locales/index.js'
const tAuth = (key) => i18n.global.t('auth.' + key)
```

---

## 9. 导出模块

### 9.1 PDF 导出

使用 `html2canvas` 截图 + `jsPDF` 拼合：

```typescript
// src/utils/export/
// 1. 遍历每张幻灯片，html2canvas 截图
// 2. 将 canvas 转为 base64 图像
// 3. jsPDF.addImage() 添加到 PDF 页面
// 4. pdf.save('presentation.pdf')
```

### 9.2 PPTX 导出

使用 `PptxGenJS`：

```typescript
const pptx = new PptxGenJS()
for (const slide of slides) {
  const s = pptx.addSlide()
  // 遍历组件，映射到 PptxGenJS API
  s.addText(text, { x, y, w, h, fontSize, bold, color })
  s.addImage({ data: base64, x, y, w, h })
  s.addChart('bar', chartData, { x, y, w, h })
}
await pptx.writeFile({ fileName: 'presentation.pptx' })
```

### 9.3 图片导出

```typescript
import { toPng, toJpeg } from 'html-to-image'
const dataUrl = await toPng(slideElement)
// 通过 file-saver 下载
```

---

## 10. 自动保存机制

`src/composables/useSlideAutoSave.ts` 实现三级保存策略：

```
内容变更
    │
    ▼
watch(markdownContent)
    │
    ▼
debouncedSave(delay=3000)   ← 3 秒防抖
    │
    ├── clearTimeout(前一个定时器)
    └── setTimeout(3000, save)
            │
            ▼
        save()
            ├── presentationApi.update()  → 主存储
            └── versionApi.createVersion() → 版本历史（可选）
```

**边界情况处理：**
- 保存中（`status === 'saving'`）不重入
- 内容未变化不触发保存
- `beforeunload` 事件触发立即强制保存
- 组件 `onUnmounted` 时检查未保存状态

---

## 11. 性能优化策略

### 11.1 编译时优化

- `unplugin-auto-import` — Vue/VueRouter API 按需自动导入
- `unplugin-vue-components` — UI 组件自动导入，无需手动 import
- `vite-plugin-compression` — gzip/brotli 压缩
- `unocss` — 按需生成 CSS，零冗余

### 11.2 运行时优化

- **parsedSlides** 使用 `computed`，依赖不变时复用缓存
- **文档 API 请求缓存**：`documentApi.getDocument` 内置 3 秒 TTL 缓存，防止重复请求
- **防抖保存**：内容变更后 3 秒静默才触发存储
- **AbortController**：AI 生成切换时中止前一个请求，防止竞态

### 11.3 大文件处理

- `VisualEditorProto.vue`（208KB）拆分为 20+ 子组件
- Konva Canvas 按幻灯片懒渲染
- ECharts 图表组件按需加载

---

## 12. 二次开发指南

### 12.1 添加新 LLM 提供商

1. 在 `src/utils/ai/providers.ts` 的 `PROVIDERS` 对象中添加：

```typescript
mynewprovider: {
  key: 'mynewprovider',
  label: 'My New LLM',
  baseUrl: 'https://api.mynewprovider.com/v1',
  models: [
    { label: 'My Model', value: 'my-model-v1' }
  ]
}
```

2. 在 `ProviderKey` 类型联合中添加 `'mynewprovider'`
3. 在 `.env.example` 中添加 `VITE_MYNEWPROVIDER_API_KEY=`
4. 在 `getEnvKeyForProvider` 映射中添加对应条目

完成！无需修改其他代码。

### 12.2 添加新幻灯片组件类型

1. 在 `src/components/slide-page/ComponentCard.vue` 中定义组件元数据
2. 在 `src/components/slide-page/panels/` 创建对应面板组件
3. 在 `src/utils/slide/` 添加渲染逻辑
4. 在 `useComponentRegistry.js` 中注册

### 12.3 修改 Demo 账号配置

在 `.env` 文件中：

```env
VITE_DEMO_ACCOUNT=your-demo@email.com
VITE_DEMO_PASSWORD=yourpassword
```

不配置时，Demo 模式为本地 Guest 会话（无需后端）。

### 12.4 对接自有后端

在 `.env` 中设置：

```env
# Vite 代理配置（开发环境）
# 见 vite.config.js 中的 server.proxy 配置

# 或直接设置 API baseURL
VITE_BASE_API_URL=https://your-backend.com
```

后端需实现以下接口：
- `POST /api/auth/login` — 返回 `{ code: 200, data: { token, user } }`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /documents`、`POST /documents`、`PUT /documents/:id`
- `POST /ai/trial/stream` — SSE 流式输出（无 API Key 时的兜底）

---

## 附录：关键文件速查

| 文件 | 作用 |
|------|------|
| `src/utils/ai/providers.ts` | LLM 提供商配置表 |
| `src/utils/ai/index.ts` | `streamGenerate` 统一入口 |
| `src/utils/ai/modelRouter.ts` | 智能模型路由 |
| `src/utils/ai/openaiStream.ts` | SSE 流式解析 |
| `src/utils/req.ts` | axios 实例 + 拦截器 |
| `src/composables/useSlideOperations.ts` | 幻灯片增删改查 |
| `src/composables/useSlideAutoSave.ts` | 防抖自动保存 |
| `src/composables/useAIGeneration.ts` | AI 生成入口 |
| `src/agents/core/AgentOrchestrator.ts` | Agent 总协调器 |
| `src/router/index.js` | 路由 + 认证守卫 |
| `src/locales/index.js` | i18n 初始化 + 语言检测 |
| `src/views/login.vue` | 登录/注册/Demo 入口 |
| `src/views/slide-page/slide-page.vue` | 编辑器主页面 |
