import { useState, useEffect, useMemo } from 'react'
import type { Agent, AgentsData } from '../types/agent'

interface UseAgentsOptions {
  searchQuery: string
  category: string
  refreshKey?: number
}

export function useAgents({ searchQuery, category, refreshKey = 0 }: UseAgentsOptions) {
  const [allAgents, setAllAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadAgents() {
      try {
        setLoading(true)
        // 添加时间戳防止缓存
        const r = await fetch(`/agents.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = (await r.json()) as AgentsData
        if (!cancelled) {
          setAllAgents(data.agents)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '加载失败')
          // fallback: 尝试从编译时静态导入加载
          try {
            const fallback = await import('../data/agents.json')
            setAllAgents((fallback as any).default?.agents || [])
          } catch {
            setAllAgents([])
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAgents()
    return () => { cancelled = true }
  }, [refreshKey])

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
    loading,
    error,
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
