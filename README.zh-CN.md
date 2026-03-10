<div align="center">

<img src="public/logo.png" alt="AIPPT Logo" width="80" />

# AIPPT

**开源 AI 驱动的演示文稿编辑器 — 基于 Vue 3 构建**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

[🚀 在线演示](https://ppt.jitword.com/jit-slide) · [📖 文档](tech/) · [🐛 问题反馈](issues) · [💬 讨论](discussions)

</div>

---

## ✨ 什么是 AIPPT（JitPPT）？

**AIPPT** 是一款功能丰富的开源 AI 演示文稿编辑器，让您在数秒内创建精美的幻灯片。它在浏览器中直接集成了主流大语言模型——DeepSeek、GPT、Claude、Gemini、Kimi、通义千问等——并支持零后端模式，可立即在本地使用。

> **一键体验，无需注册。** 在登录页点击「试用演示」即可开始。

---

## 🎯 核心亮点

| 功能 | 说明 |
|------|------|
| 🤖 **多模型支持** | DeepSeek、OpenAI、Claude、Gemini、Kimi、通义千问、智谱 GLM、豆包、Grok、MiniMax——均使用您自己的 API Key |
| ⚡ **AI 幻灯片生成** | 一句话描述即可生成完整演示文稿，实时流式预览 |
| 🎨 **可视化幻灯片编辑器** | 拖拽画布、丰富格式化、ECharts 图表、思维导图、表格 |
| 📊 **智能图表识别** | 自动检测数据结构并推荐最佳图表类型 |
| 🔊 **AI 语音助手** | 基于讯飞 ASR 的语音转文字编辑功能 |
| 🌍 **国际化（8 种语言）** | 简体中文、繁體中文、English、日本語、한국어、Bahasa、ไทย、Tiếng Việt |
| 🔌 **自定义 LLM 接口** | 接入任意兼容 OpenAI 格式的 API 端点 |
| 📤 **多格式导出** | 通过 jsPDF 和 PptxGenJS 导出为 PDF、PPTX、PNG/图片 |
| 🧩 **智能体架构** | 分层 AI 智能体系统（Core / Memory / Skills），支持扩展 AI 功能 |
| 🔒 **隐私优先** | API Key 仅存储在浏览器 localStorage 中，绝不发送至我们的服务器 |

---

## 🛠 技术栈

### 前端核心
- **[Vue 3](https://vuejs.org/)** + Composition API + `<script setup>`
- **[Vite 5](https://vitejs.dev/)** — 极速开发服务器和构建工具
- **[TypeScript](https://www.typescriptlang.org/)** — 类型安全的 composables 和工具函数
- **[Pinia](https://pinia.vuejs.org/)** — 轻量级状态管理
- **[Vue Router 4](https://router.vuejs.org/)** — 带权限守卫的 SPA 路由

### UI 与样式
- **[Arco Design Vue](https://arco.design/vue)** — 企业级组件库
- **[UnoCSS](https://unocss.dev/)** — 原子化 CSS 引擎
- **[Konva.js](https://konvajs.org/)** — 幻灯片编辑器的 Canvas 渲染
- **[Iconify](https://iconify.design/)** — 20 万+ 统一图标库

### AI 与大模型
- **流式 SSE** — 通过 `fetch` + `ReadableStream` 实现实时 Token 流
- **智能模型路由** — 根据任务上下文自动选择最优模型
- **多提供商架构** — OpenAI 兼容 API 抽象层
- **智能体系统** — 核心编排器 + 上下文记忆 + 技能注册表

### 富内容
- **[ECharts 5.5](https://echarts.apache.org/)** — 交互式数据可视化
- **[AntV G2](https://g2.antv.antgroup.com/)** — 声明式图表
- **[Mind Elixir](https://mind-elixir.com/)** — 思维导图编辑器
- **[Tiptap](https://tiptap.dev/)** — 支持数学/LaTeX 的富文本编辑
- **[KaTeX](https://katex.org/)** — 快速 LaTeX 数学公式渲染
- **[Mermaid](https://mermaid.js.org/)** — 流程图与图表支持
- **[highlight.js](https://highlightjs.org/)** + **[Shiki](https://shiki.matsu.io/)** — 代码语法高亮

### 导出
- **[jsPDF](https://github.com/parallax/jsPDF)** — PDF 导出
- **[PptxGenJS](https://gitbucket.com/gitbucket/gitbucket)** — PPTX 导出
- **[html2canvas](https://html2canvas.hertzen.com/)** + **[html-to-image](https://github.com/bubkoo/html-to-image)** — 幻灯片截图

### 开发体验
- **[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)** — 自动导入 Vue API
- **[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)** — 自动导入组件
- **ESLint + Prettier** — 统一代码风格
- **[VueUse](https://vueuse.org/)** — Vue 常用 composables 合集

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 8（`npm install -g pnpm`）

### 安装

```bash
# 克隆仓库
git clone https://github.com/MrXujiang/aippt.git
cd aippt

# 安装依赖
pnpm install

# 复制环境配置
cp .env.example .env
```

### 配置

编辑 `.env` 文件，填入您首选的大模型 API Key：

```env
# 使用以下任意一个（或多个）提供商：
VITE_DEEPSEEK_API_KEY=sk-...
VITE_OPENAI_API_KEY=sk-...
VITE_KIMI_API_KEY=...
VITE_GLM_API_KEY=...
VITE_QWEN_API_KEY=...

# （可选）演示账号，用于一键登录
VITE_DEMO_ACCOUNT=demo@aippt.cc
VITE_DEMO_PASSWORD=demo123456

# （可选）图片搜索 API
VITE_PEXELS_API_KEY=...
VITE_UNSPLASH_ACCESS_KEY=...
```

> **没有 API Key？** 没关系——使用内置演示模式，或连接您自己的后端试用接口。

### 启动

```bash
pnpm dev
```

打开 [http://localhost:5173](http://localhost:5173)，点击 **「试用演示」** 即可立即体验。

---

## 📦 构建

```bash
# 生产环境构建
pnpm build

# 预览生产构建
pnpm preview
```

---

## 🏗 项目结构

```
src/
├── agents/          # AI 智能体系统（Core / Memory / Skills）
│   ├── core/        # AgentOrchestrator + SkillRouter
│   ├── memory/      # ContextManager — 对话历史
│   └── skills/      # 技能实现（文本、图表、布局、图片等）
├── api/             # REST API 客户端（认证、文档、演示文稿、AI 等）
├── components/      # 可复用 UI 组件
│   └── slide-page/  # 幻灯片编辑器子组件（工具栏、面板、画布等）
├── composables/     # Vue composables（AI 生成、文档操作、快捷键等）
├── locales/         # i18n JSON 文件（zh、en、ja、ko、id、th、vi、zh-Hant）
├── router/          # 带权限守卫的 Vue Router
├── utils/
│   ├── ai/          # 大模型提供商、流式传输、模型路由
│   ├── export/      # PDF / PPTX / 图片导出
│   ├── import/      # PPTX / Markdown 导入
│   └── slide/       # 幻灯片渲染与布局工具
└── views/
    ├── login.vue        # 认证页，支持一键演示登录
    ├── home.vue         # 工作台仪表盘
    ├── ai-create.vue    # AI 演示文稿创建流程
    └── slide-page/      # 全功能幻灯片编辑器（100KB+ Canvas 引擎）
```

---

## 🤖 支持的大模型提供商

| 提供商 | 模型 | Key 来源 |
|--------|------|----------|
| **DeepSeek** | deepseek-chat, deepseek-reasoner | [platform.deepseek.com](https://platform.deepseek.com) |
| **OpenAI** | GPT-4o, GPT-5.2, o1, o1-mini | [platform.openai.com](https://platform.openai.com) |
| **Claude** | Claude 3.5 Sonnet, Claude Opus 4.5 | [console.anthropic.com](https://console.anthropic.com) |
| **Gemini** | Gemini 2.5 Pro/Flash | [aistudio.google.com](https://aistudio.google.com) |
| **Kimi** | Kimi K2 | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **通义千问** | Qwen3-Max, Qwen-Plus | [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com) |
| **智谱 GLM** | GLM-4.7, GLM-4-Air | [open.bigmodel.cn](https://open.bigmodel.cn) |
| **豆包** | Doubao Seed 1.6 | [console.volcengine.com](https://console.volcengine.com) |
| **Grok** | Grok 4, Grok 3 | [console.x.ai](https://console.x.ai) |
| **MiniMax** | MiniMax M2.1 | [api.minimaxi.com](https://api.minimaxi.com) |
| **自定义** | 任意兼容 OpenAI 格式的接口 | — |

---

## 🎨 功能概览

### AI 演示文稿创建
- 描述您的主题 → AI 自动生成带图表的完整幻灯片
- 内容生成时实时流式预览
- 智能任务路由：自动选择最适合当前任务的模型
- 未设置个人 API Key 时自动回退至后端试用接口

### 幻灯片编辑器
- **画布引擎** — 像素级精确的拖拽、缩放、旋转、多选
- **组件库** — 文本框、图片、形状、图表、表格、代码块、二维码
- **ECharts 集成** — 支持 20+ 图表类型的实时数据编辑器
- **思维导图** — 由 Mind Elixir 驱动，支持完整编辑
- **AI 聊天面板** — 编辑器内置 AI 助手，提供幻灯片级别建议
- **主题管理器** — 全局主题切换与调色板
- **键盘快捷键** — 完整键盘操作（撤销/重做、复制/粘贴、对齐等）
- **自动保存** — 防抖云同步

### 导入 / 导出
- 导入：PPTX（via xml2js）、Markdown（兼容 Slidev）
- 导出：PDF（jsPDF）、PPTX（PptxGenJS）、PNG/JPG（html-to-image）

### 协作就绪
- JWT 认证，localStorage 持久化
- GitHub OAuth 集成
- 文档权限模型（私有 / 只读 / 协作编辑）
- 多用户感知钩子

---

## 🌍 国际化

整个 UI 完整支持 **8 种语言**，并根据浏览器设置自动检测：

| 语言 | 代码 |
|------|------|
| 简体中文 | `zh` |
| 繁體中文 | `zh-Hant` |
| English | `en` |
| 日本語 | `ja` |
| 한국어 | `ko` |
| Bahasa Indonesia | `id` |
| ไทย | `th` |
| Tiếng Việt | `vi` |

---

## 🤝 贡献

欢迎贡献！提交 PR 前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

```bash
# Fork 仓库后：
git checkout -b feat/your-feature
# 进行修改
pnpm lint && pnpm format
git commit -m "feat: 您的功能描述"
git push origin feat/your-feature
# 发起 Pull Request
```

---

## 📄 许可证

[MIT](LICENSE) © AIPPT Contributors

---

<div align="center">

**如果这个项目对您有帮助，请给个 ⭐ — 这对我们意义重大！**

[⭐ 在 GitHub 上 Star](https://github.com/MrXujiang/aippt) 

</div>
