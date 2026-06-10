import {
  Bot,
  Code2,
  Terminal,
  Image,
  Presentation,
  FileText,
  Search,
  Volume2,
  Music,
  Video,
  ExternalLink,
  Maximize2,
} from 'lucide-react'
import type { Agent } from '../../types/agent'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot,
  Code2,
  Terminal,
  Image,
  Presentation,
  FileText,
  Search,
  Volume2,
  Music,
  Video,
}

interface AgentCardProps {
  agent: Agent
  onEmbed: (agent: Agent) => void
}

export function AgentCard({ agent, onEmbed }: AgentCardProps) {
  const Icon = iconMap[agent.icon] || Bot

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-purple-500/30 hover:bg-white/[0.06]">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <Icon className="h-5 w-5 text-purple-400" />
        </div>
        {agent.isFeatured && (
          <span className="rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
            推荐
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{agent.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-400 line-clamp-2">
        {agent.description}
      </p>
      <div className="mt-2">
        <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-gray-500">
          {agent.category}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <a
          href={agent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          打开
        </a>
        <button
          onClick={() => onEmbed(agent)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-purple-500/20 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-500/30"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          嵌入
        </button>
      </div>
    </div>
  )
}
