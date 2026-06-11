export interface Agent {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  category: string
  externalUrl: string
  embedUrl: string
  lastUpdated: string
  featured?: boolean
  embedSupported?: boolean
}

export interface AgentsData {
  agents: Agent[]
}

export type ViewMode = 'list' | 'embed'
