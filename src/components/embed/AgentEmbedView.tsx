import { ArrowLeft, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import type { Agent } from '../../types/agent'
import { useIframeLoad } from '../../hooks/useIframeLoad'

interface AgentEmbedViewProps {
  agent: Agent
  onBack: () => void
}

export function AgentEmbedView({ agent, onBack }: AgentEmbedViewProps) {
  const { isLoading, hasError, handleLoad, handleError } = useIframeLoad()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-4 border-b border-white/10 bg-black/80 px-6 py-3 backdrop-blur-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        <div className="h-5 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">{agent.name}</span>
          <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-500">
            {agent.category}
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={agent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            新标签页打开
          </a>
        </div>
      </header>
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <p className="text-sm">正在加载 {agent.name}...</p>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-gray-400">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-sm">加载失败</p>
            <p className="text-xs text-gray-500">
              该页面可能不允许在 iframe 中嵌入
            </p>
          </div>
        )}
        <iframe
          src={agent.url}
          className="h-full w-full"
          onLoad={handleLoad}
          onError={handleError}
          title={agent.name}
        />
      </div>
    </div>
  )
}
