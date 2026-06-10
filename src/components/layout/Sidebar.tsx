import {
  Bot,
  LayoutGrid,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

interface SidebarProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const navItems: { label: string; icon: LucideIcon; category: string }[] = [
  { label: '全部 Agent', icon: LayoutGrid, category: '全部' },
  { label: '推荐', icon: Sparkles, category: '__featured__' },
]

export function Sidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: SidebarProps) {
  const dynamicCategories = categories.filter((category) => category !== '全部')

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex items-center gap-3 border-b border-neutral-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Agent Store</p>
          <p className="text-xs text-neutral-500">统一管理门户</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-neutral-600">
          导航
        </p>
        <ul className="space-y-1">
          {navItems.map(({ label, icon: Icon, category }) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeCategory === category
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>

        {dynamicCategories.length > 0 && (
          <>
            <p className="mb-2 mt-6 px-3 text-xs font-medium uppercase tracking-wider text-neutral-600">
              分类
            </p>
            <ul className="space-y-1">
              {dynamicCategories.map((category) => (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(category)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeCategory === category
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <div className="border-t border-neutral-800 px-5 py-4">
        <p className="text-xs text-neutral-600">v0.1.0 · 数据驱动</p>
      </div>
    </aside>
  )
}
