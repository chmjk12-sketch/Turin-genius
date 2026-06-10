import { ChevronRight } from 'lucide-react'
import { AgentGrid } from './AgentGrid'
import type { Agent } from '../../types/agent'

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
  showViewMore = false,
}: AgentSectionProps) {
  if (agents.length === 0) return null

  return (
    <section className="mb-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          )}
        </div>
        {showViewMore && (
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-0.5 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            查看更多
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
      <AgentGrid agents={agents} onEmbed={onEmbed} />
    </section>
  )
}
