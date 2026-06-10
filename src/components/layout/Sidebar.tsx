import {
  LayoutGrid,
  MessageCircle,
  Code2,
  Image,
  FileText,
  Search,
  Volume2,
  Video,
} from 'lucide-react'
import type { Category } from '../../types/agent'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  MessageCircle,
  Code2,
  Image,
  FileText,
  Search,
  Volume2,
  Video,
}

interface SidebarProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (id: string) => void
}

export function Sidebar({ categories, activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="flex w-64 flex-col border-r border-white/10 bg-black/95">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
          <LayoutGrid className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white">Agent Store</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || LayoutGrid
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{cat.name}</span>
            </button>
          )
        })}
      </nav>
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-gray-500">AI Agent 统一管理门户</p>
      </div>
    </aside>
  )
}
