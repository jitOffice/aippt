# Agent System Architecture

**Lightweight, layered architecture for AI-powered slide editing**

Inspired by DeepSeek's enterprise patterns, adapted for maintainability and simplicity.

---

## 📁 Directory Structure

```
agents/
├── core/                      # 核心层 - Agent orchestration & routing
│   ├── AgentOrchestrator.ts   # Main agent coordinator
│   └── SkillRouter.ts         # Skill routing logic
│
├── memory/                    # 记忆层 - Context & conversation management
│   └── ContextManager.ts      # Conversation history + slide context
│
├── skills/                    # 技能层 - Skill registry & implementations
│   ├── SkillRegistry.ts       # Skill registration & discovery
│   └── implementations/       # Concrete skill implementations
│       ├── TextOptimizationSkill.ts    # Text improvement
│       ├── ImageGenerationSkill.ts     # AI image generation
│       ├── ChartGenerationSkill.ts     # Chart creation
│       ├── LayoutOptimizationSkill.ts  # Layout adjustment
│       └── IntelligentLayoutSkill.ts   # AI-powered smart layouts
│
├── utils/                     # 工具层 - Helper functions (future)
│
├── capabilities/              # Legacy - will be removed
└── index.ts                   # Public API exports
```

---

## 🎯 Architectural Principles

### **1. Separation of Concerns**
- **Core**: Orchestration logic only
- **Memory**: State management only  
- **Skills**: Task execution only
- **Utils**: Reusable helpers only

### **2. Single Responsibility**
- Each file has ONE clear purpose
- Easy to locate where to add/modify functionality

### **3. Dependency Flow**
```
Components (ChatPanel) 
    ↓
Core (AgentOrchestrator)
    ↓ ← uses
Memory (ContextManager) + Skills (Implementations)
    ↓ ← depends on
Utils (helpers)
```

---

## 🚀 Usage Examples

### **Basic Agent Call**

```typescript
import { agentOrchestrator } from '@/views/slide-page/agents'

const result = await agentOrchestrator.handleUserRequest(
  '优化当前幻灯片内容',
  {
    slideContent: '...',
    visualData: {...},
    conversationHistory: [...]
  }
)
```

### **Context Management**

```typescript
import { contextManager } from '@/views/slide-page/agents'

// Add message to history
contextManager.addMessage({
  role: 'user',
  content: '改进这个标题',
  timestamp: Date.now(),
  slideIndex: 0
})

// Get working context
const context = contextManager.getWorkingContext(userInput)

// Clear history when switching topics
contextManager.clearHistory()
```

### **Skill Registration**

```typescript
import { skillRegistry } from '@/views/slide-page/agents'
import { MyCustomSkill } from './skills/implementations/MyCustomSkill'

// Register new skill
skillRegistry.register(new MyCustomSkill())

// Search for matching skills
const skills = skillRegistry.search('优化内容')
```

---

## 📦 Public API (index.ts)

All exports go through `index.ts` for clean imports:

```typescript
// ✅ GOOD - Use public API
import { agentOrchestrator, contextManager } from '@/views/slide-page/agents'

// ❌ BAD - Don't import directly from subfolders
import { AgentOrchestrator } from '@/views/slide-page/agents/core/AgentOrchestrator'
```

---

## 🔄 Adding New Features

### **Add a New Skill**

1. Create file in `skills/implementations/`:
```typescript
// skills/implementations/VideoGenerationSkill.ts
export class VideoGenerationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'video-generation',
    name: 'Video Generation',
    keywords: ['视频', 'video', '动画'],
    // ...
  }
  
  async execute(params: SkillParams): Promise<SkillResult> {
    // Implementation
  }
}
```

2. Register in `core/AgentOrchestrator.ts`:
```typescript
import { VideoGenerationSkill } from '../skills/implementations/VideoGenerationSkill'

private registerSkills() {
  // ...existing skills
  skillRegistry.register(new VideoGenerationSkill())
}
```

### **Add Memory Feature**

Add new file in `memory/`:
```typescript
// memory/LongTermMemory.ts
export class LongTermMemory {
  // Store user preferences, common patterns, etc.
}
```

Export in `index.ts`:
```typescript
export { longTermMemory } from './memory/LongTermMemory'
```

### **Add Utility Function**

Add to `utils/`:
```typescript
// utils/textHelpers.ts
export function stripMarkdown(text: string): string {
  // ...
}
```

---

## 🎓 Design Decisions

### **Why This Structure?**

**Problem:** Previous flat structure made it hard to find where to add new features
```
agents/
├── AgentOrchestrator.ts  ← Orchestration + routing + optimization?
├── ContextManager.ts     ← Where does this live?
├── SkillRegistry.ts      ← Is this a skill or core logic?
└── TextOptimizationSkill.ts  ← Mixed with core files
```

**Solution:** Layer-based organization makes roles clear
```
agents/
├── core/          ← "Where to add orchestration logic"
├── memory/        ← "Where to manage context/history"  
├── skills/        ← "Where to add new AI capabilities"
└── utils/         ← "Where to add helper functions"
```

### **When to Create New Layers**

**Current layers are sufficient for:**
- ✅ 5-20 skills
- ✅ Single-agent system
- ✅ Conversation memory only
- ✅ Embedded in app

**Add new layers when you need:**
- 🟡 `workflow/` - Multi-step pipelines (e.g., "Generate outline → Add content → Add images → Review")
- 🟡 `adapters/` - Multiple LLM providers (OpenAI, Claude, local models)
- 🟡 `services/` - Business logic extraction (quality scoring, content analysis)
- 🔴 `communication/` - Event bus for multi-agent coordination

---

## 🚦 Migration Guide

### **Old Import Paths**
```typescript
// Before reorganization
import { AgentOrchestrator } from '../agents/AgentOrchestrator'
import { ContextManager } from '../agents/ContextManager'  
import { TextOptimizationSkill } from '../agents/skills/TextOptimizationSkill'
```

### **New Import Paths**
```typescript
// After reorganization - use public API
import { agentOrchestrator, contextManager } from '@/views/slide-page/agents'

// Or direct imports (when needed)
import { AgentOrchestrator } from '../agents/core/AgentOrchestrator'
import { ContextManager } from '../agents/memory/ContextManager'
import { TextOptimizationSkill } from '../agents/skills/implementations/TextOptimizationSkill'
```

---

## 📊 Comparison with Enterprise Architecture

| Feature | **Our Structure** | **DeepSeek Full** |
|---------|------------------|-------------------|
| **Layers** | 4 (core, memory, skills, utils) | 9 (core, domain, services, adapters, etc.) |
| **Complexity** | Low | Very High |
| **Files** | ~15 files | 50+ files |
| **Use Case** | Embedded agent in slide editor | Enterprise multi-agent platform |
| **Scalability** | 50-100 skills | 1000+ skills |
| **Learning Curve** | 2-3 days | 2 weeks |

---

## ✅ Summary

**This structure provides:**

1. ✅ **Clear organization** - Know where to find/add features
2. ✅ **Separation of concerns** - Core logic separate from memory/skills
3. ✅ **Easy to understand** - Simple layer-based design
4. ✅ **Room to grow** - Can add new layers when needed
5. ✅ **Maintainable** - Each file has single responsibility

**Perfect balance between:**
- DeepSeek's enterprise patterns (clear layers)
- Your app's needs (simple, fast, integrated)
