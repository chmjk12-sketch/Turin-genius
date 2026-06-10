import { Calendar, ExternalLink, LayoutPanelTop } from 'lucide-react'
import { formatLastUpdated } from '../../hooks/useAgents'
import type { Agent } from '../../types/agent'

interface AgentCardProps {
  agent: Agent
  onEmbed: (agent: Agent) => void
}

export function AgentCard({ agent, onEmbed }: AgentCardProps) {
  const handleExternalOpen = () => {
    window.open(agent.externalUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950 transition-all duration-200 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/40">
      <div
        className={`flex h-36 items-center justify-center bg-gradient-to-br ${agent.iconBg}`}
      >
        {agent.icon.startsWith('/') || agent.icon.startsWith('http') ? (
          <img
            src={agent.icon}
            alt={agent.name}
            className="h-16 w-16 rounded-2xl object-cover"
          />
        ) : (
          <span className="text-5xl" role="img" aria-label={agent.name}>
            {agent.icon}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-base font-semibold text-white">
          {agent.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>更新于 {formatLastUpdated(agent.lastUpdated)}</span>
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-400">
          {agent.description}
        </p>

        <div className="mt-4 flex gap-2 opacity-100 transition-opacity sm:opacity-80 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={handleExternalOpen}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-200 transition-colors hover:border-neutral-600 hover:bg-neutral-800"
            title="在新标签页打开"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            外链
          </button>
          <button
            type="button"
            onClick={() => onEmbed(agent)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-neutral-200"
            title="内嵌模式打开"
          >
            <LayoutPanelTop className="h-3.5 w-3.5" />
            内嵌
          </button>
        </div>
      </div>
    </article>
  )
}
