import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = '搜索 Agent 名称、描述或分类…',
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-full border border-neutral-800 bg-neutral-900/80 pl-12 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-600 focus:bg-neutral-900"
      />
    </div>
  )
}
