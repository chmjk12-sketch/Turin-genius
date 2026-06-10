import { AgentCard } from './AgentCard'
import type { Agent } from '../../types/agent'

interface AgentGridProps {
  agents: Agent[]
  onEmbed: (agent: Agent) => void
}

export function AgentGrid({ agents, onEmbed }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 py-16 text-center">
        <p className="text-sm text-neutral-400">没有找到匹配的 Agent</p>
        <p className="mt-1 text-xs text-neutral-600">试试调整搜索关键词或分类筛选</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onEmbed={onEmbed} />
      ))}
    </div>
  )
}
