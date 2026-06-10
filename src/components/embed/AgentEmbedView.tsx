import { AlertCircle, ExternalLink, Loader2, RotateCcw } from 'lucide-react'
import { useIframeLoad } from '../../hooks/useIframeLoad'
import type { Agent } from '../../types/agent'

interface IframeLoaderProps {
  agent: Agent
  loadKey: number
  onLoad: () => void
  onError: () => void
  onRetry: () => void
  isLoading: boolean
  hasError: boolean
}

export function IframeLoader({
  agent,
  loadKey,
  onLoad,
  onError,
  onRetry,
  isLoading,
  hasError,
}: IframeLoaderProps) {
  const handleExternalOpen = () => {
    window.open(agent.externalUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="relative flex-1 bg-neutral-950">
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-950/90">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-400">正在加载 {agent.name}…</p>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-950 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
            <AlertCircle className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">无法内嵌显示此 Agent</p>
            <p className="mt-1 max-w-md text-sm text-neutral-500">
              该站点可能设置了 X-Frame-Options 或 CSP 限制，不允许在 iframe 中加载。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 transition-colors hover:bg-neutral-900"
            >
              <RotateCcw className="h-4 w-4" />
              重试
            </button>
            <button
              type="button"
              onClick={handleExternalOpen}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
            >
              <ExternalLink className="h-4 w-4" />
              在新标签页打开
            </button>
          </div>
        </div>
      )}

      <iframe
        key={loadKey}
        src={agent.embedUrl}
        title={agent.name}
        className="h-full w-full border-0"
        onLoad={onLoad}
        onError={onError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  )
}

interface AgentEmbedViewProps {
  agent: Agent
  onBack: () => void
}

export function AgentEmbedView({ agent, onBack }: AgentEmbedViewProps) {
  const { isLoading, hasError, loadKey, handleLoad, handleError, retry } =
    useIframeLoad({
      src: agent.embedUrl,
      enabled: true,
    })

  const iconDisplay =
    agent.icon.startsWith('http') || agent.icon.startsWith('/')
      ? '🤖'
      : agent.icon

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-neutral-800 px-6 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-white"
        >
          ← 返回列表
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">{iconDisplay}</span>
          <span className="text-sm font-medium text-white">{agent.name}</span>
        </div>
      </div>

      <IframeLoader
        agent={agent}
        loadKey={loadKey}
        onLoad={handleLoad}
        onError={handleError}
        onRetry={retry}
        isLoading={isLoading}
        hasError={hasError}
      />
    </div>
  )
}
