# JitSlide Hybrid AI System

## Overview

JitSlide implements a **hybrid AI model routing system** that automatically selects the optimal AI model based on task requirements:

- **DeepSeek V3/Reasoner**: Deep reasoning, complex content generation, document parsing
- **MiniMax M2.1 Lightning**: Real-time interactions, quick edits, instant responses

This architecture is inspired by **Gamma's approach** to AI-powered presentations, ensuring both quality and speed.

---

## Architecture

### Model Selection Logic

```typescript
Task Type                    → Selected Model
────────────────────────────────────────────────────
Document Parsing             → DeepSeek Chat
Long-form Generation (>8)    → DeepSeek Chat  
Industry Reports             → DeepSeek Reasoner
Deep Content                 → DeepSeek Chat

Real-time Chat               → MiniMax Lightning
Quick Edits (<100 chars)     → MiniMax Lightning
Layout Adjustments           → MiniMax Lightning
Text Polishing               → MiniMax M2.1
Theme Changes                → MiniMax Lightning
```

### Files Structure

```
src/utils/ai/
├── index.ts           # Main entry point with hybrid routing
├── modelRouter.ts     # Task classification & model selection
├── config.ts          # AI settings management
├── providers.ts       # Provider configurations
├── setup.ts           # Quick API key setup helpers
└── openaiStream.ts    # Streaming API client
```

---

## Setup Instructions

### Option 1: Browser Console Setup (Quick Test)

1. Open browser DevTools Console
2. Run one of these commands:

```javascript
// For DeepSeek only
import { setupDeepSeek } from '@/utils/ai/setup'
setupDeepSeek('sk-your-deepseek-key-here')

// For MiniMax only
import { setupMiniMax } from '@/utils/ai/setup'
setupMiniMax('sk-your-minimax-key-here')

// For both models (same key)
import { setupBothModels } from '@/utils/ai/setup'
setupBothModels('sk-your-unified-key-here')
```

3. Check configuration:
```javascript
import { checkAIConfig } from '@/utils/ai/setup'
checkAIConfig()
```

### Option 2: Environment Variable

Add to `.env` file:

```bash
# DeepSeek API Key (for main slide generation)
VITE_DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# MiniMax API Key (for real-time chat interactions)
VITE_MINIMAX_API_KEY=your-minimax-key-here

# Other supported providers
VITE_KIMI_API_KEY=your-kimi-key-here
VITE_GLM_API_KEY=your-glm-key-here
VITE_QWEN_API_KEY=your-qwen-key-here
VITE_DOUBAO_API_KEY=your-doubao-key-here
VITE_OPENAI_API_KEY=sk-your-openai-key-here
VITE_CLAUDE_API_KEY=sk-ant-your-claude-key-here
VITE_GEMINI_API_KEY=your-gemini-key-here
VITE_GROK_API_KEY=xai-your-grok-key-here
```

The system will automatically use provider-specific keys as fallback.

**Priority Order**:
1. Provider-specific API key in localStorage settings
2. Environment variable (`VITE_{PROVIDER}_API_KEY`)
3. Generic `apiKey` field (backward compatibility)

### Option 3: Programmatic Setup

**Single Provider**:
```typescript
import { setAISettings } from '@/utils/ai/config'

setAISettings({
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: 'sk-your-key-here',
  temperature: 0.7,
})
```

**Multiple Providers** (Recommended for hybrid AI):
```typescript
import { setAISettings } from '@/utils/ai/config'

setAISettings({
  provider: 'deepseek', // Default provider
  model: 'deepseek-chat',
  temperature: 0.7,
  apiKeys: {
    deepseek: 'sk-your-deepseek-key',
    minimax: 'your-minimax-key',
    openai: 'sk-your-openai-key',
  },
})
```

With multiple API keys configured, the router will automatically select the appropriate key when switching models.
```

---

## Usage Examples

### Automatic Model Routing (Recommended)

The system automatically selects the best model:

```typescript
import { streamGenerate } from '@/utils/ai/index'

// Automatically uses DeepSeek for complex generation
streamGenerate(
  'Create a 10-slide presentation about AI ethics',
  SYSTEM_PROMPT,
  {
    onDelta: (chunk) => console.log(chunk),
    onDone: () => console.log('Done!'),
  },
  undefined,
  {
    taskContext: {
      slideCount: 0, // Will trigger long-form task
    }
  }
)

// Automatically uses MiniMax for chat
streamGenerate(
  'Make this slide title bigger',
  SYSTEM_PROMPT,
  {
    onDelta: (chunk) => console.log(chunk),
    onDone: () => console.log('Done!'),
  },
  undefined,
  {
    taskContext: {
      isChat: true, // Forces MiniMax Lightning
    }
  }
)
```

### Manual Model Override

Force a specific model when needed:

```typescript
// Force DeepSeek for complex analysis
streamGenerate(
  userPrompt,
  systemPrompt,
  handlers,
  controller,
  {
    provider: 'deepseek',
    model: 'deepseek-reasoner',
  }
)

// Force MiniMax for instant response
streamGenerate(
  userPrompt,
  systemPrompt,
  handlers,
  controller,
  {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
  }
)
```

---

## Task Classification Rules

### DeepSeek Tasks
- **Document parsing**: Keywords like "parse", "pdf", "word"
- **Long presentations**: `slideCount > 8`
- **Industry reports**: Keywords like "report", "analysis", "market", "research"
- **Complex content**: Prompt length > 200 characters

### MiniMax Tasks
- **Real-time chat**: `isChat: true` context
- **Quick edits**: Prompt length < 100 characters
- **Layout changes**: Keywords like "layout", "column", "align", "position"
- **Theme changes**: Keywords like "theme", "color", "style", "background"
- **Text polishing**: Keywords like "improve", "polish", "refine", "rewrite"

---

## Component Integration

### Main Slide Generation (slide-page.vue)

Uses **automatic routing** based on slide count:

```typescript
const generatePresentation = async (userPrompt) => {
  abortController = streamGenerate(
    prompt,
    SYSTEM_PROMPT,
    handlers,
    undefined,
    {
      taskContext: {
        slideCount: parsedSlides.value.length,
        hasDocument: false,
      }
    }
  )
}
```

### ChatPanel (Real-time Chat)

Forces **MiniMax Lightning** for instant responses:

```typescript
streamGenerate(
  userInput,
  systemPrompt,
  handlers,
  undefined,
  {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
  }
)
```

---

## API Key Management

### Storage Location
- **LocalStorage**: `pxdoc_ai_settings` (supports multiple provider keys)
- **Environment Variables**: 
  - `VITE_DEEPSEEK_API_KEY` - For DeepSeek models
  - `VITE_MINIMAX_API_KEY` - For MiniMax models
  - `VITE_KIMI_API_KEY`, `VITE_GLM_API_KEY`, etc. - For other providers

### API Key Resolution Priority

When the system needs to call an AI provider, it resolves the API key in this order:

1. **Provider-specific key in settings** - `settings.apiKeys[provider]`
2. **Environment variable** - `VITE_{PROVIDER}_API_KEY`
3. **Generic apiKey field** - `settings.apiKey` (backward compatibility)

**Example**: When ChatPanel forces MiniMax:
```typescript
// ChatPanel calls with provider override
streamGenerate(userInput, systemPrompt, handlers, undefined, {
  provider: 'minimax',
  model: 'minimax-m2.1-lightning',
})

// System resolves API key:
// 1. Check settings.apiKeys.minimax
// 2. Check import.meta.env.VITE_MINIMAX_API_KEY
// 3. Fallback to settings.apiKey (if configured for minimax)
```

### Security Notes
- API keys are stored in browser localStorage
- Keys are sent directly to AI provider APIs
- No server-side storage required for testing
- For production, implement server-side key management

---

## Testing the Hybrid System

### Test DeepSeek (Complex Generation)

1. Open JitSlide
2. Click "AI Agent" button
3. Enter: `"Create a comprehensive 10-slide business plan presentation"`
4. Check console: Should see `[AI Router] Task: Deep content generation (DeepSeek)`

### Test MiniMax (Quick Edit)

1. Open ChatPanel (Agent button in header)
2. Type: `"Make the title bigger"`
3. Check console: Should see `[AI Router] Selected: minimax/minimax-m2.1-lightning`

### Verify Configuration

**Check API Key Resolution**:
```javascript
// In browser console
import { getAISettings, getProviderApiKey } from '@/utils/ai/config'

const settings = getAISettings()
console.log('Settings:', settings)

// Test provider-specific key resolution
console.log('DeepSeek Key:', getProviderApiKey('deepseek', settings) ? '✓ Configured' : '✗ Missing')
console.log('MiniMax Key:', getProviderApiKey('minimax', settings) ? '✓ Configured' : '✗ Missing')
```

**Expected Output**:
```
Settings: {
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKeys: {
    deepseek: 'sk-xxx...',
    minimax: 'xxx...'
  }
}
DeepSeek Key: ✓ Configured
MiniMax Key: ✓ Configured
```

**Verify Environment Variables** (in Vite dev server):
```javascript
console.log('DeepSeek Env:', import.meta.env.VITE_DEEPSEEK_API_KEY ? '✓ Set' : '✗ Not set')
console.log('MiniMax Env:', import.meta.env.VITE_MINIMAX_API_KEY ? '✓ Set' : '✗ Not set')
```
```

---

## Performance Characteristics

### DeepSeek
- **Latency**: ~2-5 seconds first token
- **Quality**: Excellent reasoning and depth
- **Cost**: ~¥1 per 1M tokens (very economical)
- **Best for**: Long-form, complex logic

### MiniMax Lightning
- **Latency**: <500ms first token
- **Quality**: Good for quick tasks
- **Cost**: ~¥4 per 1M tokens
- **Best for**: Real-time interactions

---

## Troubleshooting

### Issue: "Base URL is not configured"
**Solution**: API key is missing. Run `setupDeepSeek()` or `setupMiniMax()`

### Issue: Chat not responding
**Solution**: Check browser console for errors. Verify API key is valid.

### Issue: Using wrong model
**Solution**: Check console logs for `[AI Router]` messages. Verify task context is correct.

### Issue: CORS errors
**Solution**: AI provider APIs are called directly from browser. Ensure CORS is enabled or use proxy.

---

## Future Enhancements

- [ ] Document-to-Slide parser (DeepSeek)
- [ ] Voice synthesis for presentations (MiniMax)
- [ ] Multi-model comparison mode
- [ ] Cost tracking and optimization
- [ ] Model performance analytics
- [ ] Server-side API key management

---

## Credits

Implementation based on hybrid AI strategy inspired by:
- **Gamma**: AI presentation platform
- **DeepSeek**: Chinese AI reasoning model
- **MiniMax**: Fast interaction model

Built for **JitSlide** - AI-powered presentation editor.
