<div align="center">

<img src="public/logo.png" alt="jit ppt Logo" width="80" />

# AIPPT

**Open-source AI-Powered Presentation Editor — Built with Vue 3**

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

[🚀 Live Demo](https://ppt.jitword.com/jit-slide) · [📖 Docs](tech/) · [🐛 Issues](issues) · [💬 Discussions](discussions) · [🇨🇳 中文文档](README.zh-CN.md)

</div>

---

## ✨ What is AIPPT(JitPPT)?

**AIPPT.cc** is a feature-rich, open-source AI presentation editor that lets you create stunning slide decks in seconds. It integrates mainstream LLMs directly in the browser — DeepSeek, GPT, Claude, Gemini, Kimi, Qwen, and more — with a zero-backend-required mode for instant local use.

> **One-click demo, no registration needed.** Just click "Try Demo" on the login page.

---

## 🎯 Core Highlights

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-LLM Support** | DeepSeek, OpenAI, Claude, Gemini, Kimi, Qwen, GLM, Doubao, Grok, MiniMax — all with your own API key |
| ⚡ **AI Slide Generation** | Generate full presentations from a single prompt, streamed in real-time |
| 🎨 **Visual Slide Editor** | Drag-and-drop canvas, rich formatting, ECharts charts, mind maps, tables |
| 📊 **Smart Chart Detection** | Auto-detects data structure and recommends the best chart type |
| 🔊 **AI Voice Assistant** | Speech-to-text editing powered by iFlytek ASR |
| 🌍 **i18n (8 Languages)** | 简体中文, 繁體中文, English, 日本語, 한국어, Bahasa, ไทย, Tiếng Việt |
| 🔌 **Custom LLM Endpoint** | Plug in any OpenAI-compatible API endpoint |
| 📤 **Multi-format Export** | Export to PDF, PPTX, PNG/images via jsPDF & PptxGenJS |
| 🧩 **Agent Architecture** | Layered AI agent system (Core / Memory / Skills) for extensible AI features |
| 🔒 **Privacy First** | API keys stored only in your browser's localStorage — never sent to our servers |

---

## 🛠 Tech Stack

### Frontend Core
- **[Vue 3](https://vuejs.org/)** + Composition API + `<script setup>`
- **[Vite 5](https://vitejs.dev/)** — lightning-fast dev server & build
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe composables & utilities
- **[Pinia](https://pinia.vuejs.org/)** — lightweight state management
- **[Vue Router 4](https://router.vuejs.org/)** — SPA routing with auth guards

### UI & Styling
- **[Arco Design Vue](https://arco.design/vue)** — enterprise-grade component library
- **[UnoCSS](https://unocss.dev/)** — atomic CSS engine
- **[Konva.js](https://konvajs.org/)** — canvas rendering for slide editor
- **[Iconify](https://iconify.design/)** — 200,000+ unified icons

### AI & LLM
- **Streaming SSE** — real-time token streaming via `fetch` + `ReadableStream`
- **Smart Model Router** — automatic model selection based on task context
- **Multi-provider Architecture** — OpenAI-compatible API abstraction layer
- **Agent System** — Core Orchestrator + Context Memory + Skill Registry

### Rich Content
- **[ECharts 5.5](https://echarts.apache.org/)** — interactive data visualizations
- **[AntV G2](https://g2.antv.antgroup.com/)** — declarative charting
- **[Mind Elixir](https://mind-elixir.com/)** — mind map editor
- **[Tiptap](https://tiptap.dev/)** — rich text editing with math/LaTeX
- **[KaTeX](https://katex.org/)** — fast LaTeX math rendering
- **[Mermaid](https://mermaid.js.org/)** — diagram and flowchart support
- **[highlight.js](https://highlightjs.org/)** + **[Shiki](https://shiki.matsu.io/)** — code syntax highlighting

### Export
- **[jsPDF](https://github.com/parallax/jsPDF)** — PDF export
- **[PptxGenJS](https://gitbucket.com/gitbucket/gitbucket)** — PPTX export
- **[html2canvas](https://html2canvas.hertzen.com/)** + **[html-to-image](https://github.com/bubkoo/html-to-image)** — slide screenshot

### Developer Experience
- **[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)** — auto-import Vue APIs
- **[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)** — auto-import components
- **ESLint + Prettier** — consistent code style
- **[VueUse](https://vueuse.org/)** — collection of essential Vue composables

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8 (`npm install -g pnpm`)

### Installation

```bash
# Clone the repo
git clone https://github.com/MrXujiang/aippt.git
cd aippt

# Install dependencies
pnpm install

# Copy environment config
cp .env.example .env
```

### Configuration

Edit `.env` with your preferred LLM API key:

```env
# Use any one (or more) of these providers:
VITE_DEEPSEEK_API_KEY=sk-...
VITE_OPENAI_API_KEY=sk-...
VITE_KIMI_API_KEY=...
VITE_GLM_API_KEY=...
VITE_QWEN_API_KEY=...

# (Optional) Demo account for one-click login
VITE_DEMO_ACCOUNT=demo@aippt.cc
VITE_DEMO_PASSWORD=demo123456

# (Optional) Image search APIs
VITE_PEXELS_API_KEY=...
VITE_UNSPLASH_ACCESS_KEY=...
```

> **No API key?** No problem — use the built-in Demo mode or connect to your own backend trial endpoint.

### Run

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and click **"Try Demo"** to get started instantly.

---

## 📦 Build

```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

---

## 🏗 Project Structure

```
src/
├── agents/          # AI agent system (Core / Memory / Skills)
│   ├── core/        # AgentOrchestrator + SkillRouter
│   ├── memory/      # ContextManager — conversation history
│   └── skills/      # Skill implementations (text, chart, layout, image...)
├── api/             # REST API clients (auth, document, presentation, AI...)
├── components/      # Reusable UI components
│   └── slide-page/  # Slide editor sub-components (toolbar, panels, canvas...)
├── composables/     # Vue composables (AI generation, document ops, shortcuts...)
├── locales/         # i18n JSON files (zh, en, ja, ko, id, th, vi, zh-Hant)
├── router/          # Vue Router with auth guards
├── utils/
│   ├── ai/          # LLM providers, streaming, model router
│   ├── export/      # PDF / PPTX / image export
│   ├── import/      # PPTX / Markdown import
│   └── slide/       # Slide rendering & layout utilities
└── views/
    ├── login.vue        # Auth page with demo one-click login
    ├── home.vue         # Workspace dashboard
    ├── ai-create.vue    # AI presentation creation flow
    └── slide-page/      # Full-featured slide editor (100KB+ canvas engine)
```

---

## 🤖 Supported LLM Providers

| Provider | Models | Key Source |
|----------|--------|------------|
| **DeepSeek** | deepseek-chat, deepseek-reasoner | [platform.deepseek.com](https://platform.deepseek.com) |
| **OpenAI** | GPT-4o, GPT-5.2, o1, o1-mini | [platform.openai.com](https://platform.openai.com) |
| **Claude** | Claude 3.5 Sonnet, Claude Opus 4.5 | [console.anthropic.com](https://console.anthropic.com) |
| **Gemini** | Gemini 2.5 Pro/Flash | [aistudio.google.com](https://aistudio.google.com) |
| **Kimi** | Kimi K2 | [platform.moonshot.cn](https://platform.moonshot.cn) |
| **Qwen** | Qwen3-Max, Qwen-Plus | [dashscope.aliyuncs.com](https://dashscope.aliyuncs.com) |
| **GLM** | GLM-4.7, GLM-4-Air | [open.bigmodel.cn](https://open.bigmodel.cn) |
| **Doubao** | Doubao Seed 1.6 | [console.volcengine.com](https://console.volcengine.com) |
| **Grok** | Grok 4, Grok 3 | [console.x.ai](https://console.x.ai) |
| **MiniMax** | MiniMax M2.1 | [api.minimaxi.com](https://api.minimaxi.com) |
| **Custom** | Any OpenAI-compatible endpoint | — |

---

## 🎨 Features Overview

### AI Presentation Creation
- Describe your topic → AI generates a full slide deck with charts
- Real-time streaming preview as content is generated
- Smart task routing: automatically picks the best model for the job
- Fallback to backend trial API when no personal API key is set

### Slide Editor
- **Canvas Engine** — pixel-perfect drag, resize, rotate, multi-select
- **Component Library** — text boxes, images, shapes, charts, tables, code blocks, QR codes
- **ECharts Integration** — live chart data editor with 20+ chart types
- **Mind Map** — powered by Mind Elixir with full edit support
- **AI Chat Panel** — in-editor AI assistant for slide-level suggestions
- **Theme Manager** — global theme switching with color palette
- **Keyboard Shortcuts** — full keyboard navigation (undo/redo, copy/paste, align...)
- **Auto-save** — debounced cloud sync

### Import / Export
- Import: PPTX (via xml2js), Markdown (Slidev-compatible)
- Export: PDF (jsPDF), PPTX (PptxGenJS), PNG/JPG (html-to-image)

### Collaboration-Ready
- JWT auth with localStorage persistence
- GitHub OAuth integration
- Document permission model (private / read-only / collaborative edit)
- Multi-user awareness hooks

---

## 🌍 Internationalization

The entire UI is fully localized in **8 languages** and auto-detected from browser settings:

| Language | Code |
|----------|------|
| 简体中文 | `zh` |
| 繁體中文 | `zh-Hant` |
| English | `en` |
| 日本語 | `ja` |
| 한국어 | `ko` |
| Bahasa Indonesia | `id` |
| ไทย | `th` |
| Tiếng Việt | `vi` |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a PR.

```bash
# Fork the repo, then:
git checkout -b feat/your-feature
# Make your changes
pnpm lint && pnpm format
git commit -m "feat: your feature description"
git push origin feat/your-feature
# Open a Pull Request
```

---

## 📄 License

[MIT](LICENSE) © AIPPT Contributors

---

<div align="center">

**If this project helps you, please give it a ⭐ — it means a lot!**

[⭐ Star on GitHub](https://github.com/MrXujiang/aippt) 

</div>
