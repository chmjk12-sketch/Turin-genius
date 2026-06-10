import type { Agent } from '../../types/agent'
import { AgentCard } from './AgentCard'

interface AgentGridProps {
  agents: Agent[]
  onEmbed: (agent: Agent) => void
}

export function AgentGrid({ agents, onEmbed }: AgentGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <p className="text-lg">没有找到匹配的 Agent</p>
        <p className="mt-1 text-sm">试试修改搜索条件或筛选分类</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onEmbed={onEmbed} />
      ))}
    </div>
  )
}
