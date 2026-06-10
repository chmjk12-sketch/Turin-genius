import { SearchBar } from '../ui/SearchBar'

interface MainHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  resultCount: number
}

export function MainHeader({ searchQuery, onSearchChange, resultCount }: MainHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">Agent 列表</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {searchQuery.trim()
              ? `找到 ${resultCount} 个结果`
              : `共 ${resultCount} 个 Agent`}
          </p>
        </div>
        <div className="w-80">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
      </div>
    </header>
  )
}
