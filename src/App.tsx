import { useState } from 'react'
import { AgentSection } from './components/agents/AgentSection'
import { AgentEmbedView } from './components/embed/AgentEmbedView'
import { MainHeader } from './components/layout/MainHeader'
import { Sidebar } from './components/layout/Sidebar'
import { useAgents } from './hooks/useAgents'
import type { Agent, ViewMode } from './types/agent'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  const { categories, filteredAgents, featuredAgents, regularAgents } =
    useAgents({ searchQuery, category: activeCategory })

  const handleEmbed = (agent: Agent) => {
    setSelectedAgent(agent)
    setViewMode('embed')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedAgent(null)
  }

  const showFeaturedSection =
    activeCategory === '全部' && featuredAgents.length > 0 && !searchQuery.trim()

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main className="flex min-h-screen flex-1 flex-col overflow-hidden">
        {viewMode === 'list' ? (
          <>
            <MainHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              resultCount={filteredAgents.length}
            />
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {showFeaturedSection && (
                <AgentSection
                  title="推荐 Agent"
                  subtitle="精选 AI 工具，提升你的工作效率"
                  agents={featuredAgents}
                  onEmbed={handleEmbed}
                  showViewMore
                />
              )}
              <AgentSection
                title={showFeaturedSection ? '全部 Agent' : 'Agent 列表'}
                subtitle={activeCategory === '__featured__' ? '为你推荐的 Agent' : activeCategory !== '全部' ? `分类：${activeCategory}` : undefined}
                agents={showFeaturedSection ? regularAgents : filteredAgents}
                onEmbed={handleEmbed}
              />
            </div>
          </>
        ) : (
          selectedAgent && (
            <AgentEmbedView agent={selectedAgent} onBack={handleBackToList} />
          )
        )}
      </main>
    </div>
  )
}

export default App
