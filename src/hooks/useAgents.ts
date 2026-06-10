import { useMemo } from 'react'
import agentsData from '../data/agents.json'
import type { Agent, AgentsData } from '../types/agent'

interface UseAgentsOptions {
  searchQuery: string
  category: string
}

export function useAgents({ searchQuery, category }: UseAgentsOptions) {
  const allAgents = (agentsData as AgentsData).agents

  const categories = useMemo(() => {
    const set = new Set(allAgents.map((agent) => agent.category))
    return ['全部', ...Array.from(set)]
  }, [allAgents])

  const filteredAgents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return allAgents.filter((agent) => {
      const matchesCategory =
        category === '全部' ||
        (category === '__featured__' && agent.featured) ||
        agent.category === category

      if (!matchesCategory) return false
      if (!query) return true

      return (
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query) ||
        agent.category.toLowerCase().includes(query)
      )
    })
  }, [allAgents, searchQuery, category])

  const featuredAgents = useMemo(
    () => filteredAgents.filter((agent) => agent.featured),
    [filteredAgents],
  )

  const regularAgents = useMemo(
    () => filteredAgents.filter((agent) => !agent.featured),
    [filteredAgents],
  )

  return {
    allAgents,
    categories,
    filteredAgents,
    featuredAgents,
    regularAgents,
  }
}

export function formatLastUpdated(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export type { Agent }
