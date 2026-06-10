import { useMemo } from 'react'
import agentsData from '../data/agents.json'
import type { Agent, Category } from '../types/agent'

interface UseAgentsOptions {
  searchQuery: string
  category: string
}

interface UseAgentsResult {
  categories: Category[]
  filteredAgents: Agent[]
  featuredAgents: Agent[]
  regularAgents: Agent[]
}

const defaultCategories: Category[] = [
  { id: '全部', name: '全部', icon: 'LayoutGrid' },
  { id: '对话助手', name: '对话助手', icon: 'MessageCircle' },
  { id: '编程开发', name: '编程开发', icon: 'Code2' },
  { id: '图像生成', name: '图像生成', icon: 'Image' },
  { id: '办公效率', name: '办公效率', icon: 'FileText' },
  { id: '搜索研究', name: '搜索研究', icon: 'Search' },
  { id: '音频处理', name: '音频处理', icon: 'Volume2' },
  { id: '视频生成', name: '视频生成', icon: 'Video' },
]

export function useAgents({ searchQuery, category }: UseAgentsOptions): UseAgentsResult {
  const agents = agentsData as Agent[]

  const categories = defaultCategories

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesCategory = category === '全部' || agent.category === category
      const matchesSearch =
        !searchQuery.trim() ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [agents, category, searchQuery])

  const featuredAgents = useMemo(() => {
    if (category !== '全部') return []
    return filteredAgents.filter((a) => a.isFeatured)
  }, [filteredAgents, category])

  const regularAgents = useMemo(() => {
    return filteredAgents.filter((a) => !a.isFeatured)
  }, [filteredAgents])

  return { categories, filteredAgents, featuredAgents, regularAgents }
}
