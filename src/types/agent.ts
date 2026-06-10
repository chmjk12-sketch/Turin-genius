export interface Agent {
  id: string
  name: string
  description: string
  category: string
  icon: string
  url: string
  isFeatured: boolean
}

export type ViewMode = 'list' | 'embed'

export interface Category {
  id: string
  name: string
  icon: string
}
