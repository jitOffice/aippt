export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }

export interface StreamArgs {
  url: string
  apiKey: string
  model: string
  messages: ChatMessage[]
  temperature?: number
  headers?: Record<string, string>
  signal?: AbortSignal
}

// Parse OpenAI-style SSE stream with lines starting with 'data: {json}' and terminating with [DONE]
export async function streamOpenAI(args: StreamArgs, onDelta: (delta: string) => void): Promise<void> {
  const { url, apiKey, model, messages, temperature = 0.7, headers = {}, signal } = args
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...headers,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      stream: true,
    }),
    signal,
  })

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '')
    throw new Error(`Stream request failed: ${res.status} ${text}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buf = ''

  while (true) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })

    let idx: number
    while ((idx = buf.indexOf('\n\n')) !== -1) {
      const chunk = buf.slice(0, idx)
      buf = buf.slice(idx + 2)
      const lines = chunk.split('\n')
      for (const line of lines) {
        const s = line.trim()
        if (!s.startsWith('data:')) continue
        const data = s.slice(5).trim()
        if (data === '[DONE]') return
        try {
          const json = JSON.parse(data)
          const delta = json?.choices?.[0]?.delta?.content ?? ''
          if (delta) onDelta(delta)
        } catch (e) {
          // ignore parse errors for keep-alive events
        }
      }
    }
  }
}

