import { SearchBar } from '../ui/SearchBar'

interface MainHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  resultCount: number
}

export function MainHeader({
  searchQuery,
  onSearchChange,
  resultCount,
}: MainHeaderProps) {
  return (
    <header className="border-b border-neutral-800/80 bg-black/60 px-8 py-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <p className="text-xs text-neutral-500">
          共 {resultCount} 个 Agent
        </p>
      </div>
    </header>
  )
}
