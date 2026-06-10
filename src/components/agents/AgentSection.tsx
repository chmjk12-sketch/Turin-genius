import type { Agent } from '../../types/agent'
import { AgentGrid } from './AgentGrid'

interface AgentSectionProps {
  title: string
  subtitle?: string
  agents: Agent[]
  onEmbed: (agent: Agent) => void
  showViewMore?: boolean
}

export function AgentSection({
  title,
  subtitle,
  agents,
  onEmbed,
  showViewMore,
}: AgentSectionProps) {
  const displayAgents = showViewMore ? agents.slice(0, 8) : agents

  return (
    <section className="mb-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
        {showViewMore && agents.length > 8 && (
          <button className="text-sm text-purple-400 transition-colors hover:text-purple-300">
            查看更多 &rarr;
          </button>
        )}
      </div>
      <AgentGrid agents={displayAgents} onEmbed={onEmbed} />
    </section>
  )
}
