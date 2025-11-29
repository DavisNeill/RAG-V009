import { useState } from 'react'
import { Slate } from 'slate-react'
import { CustomEditor, PageSettings } from '@/types'
import { HomeTab } from './ribbon/HomeTab'
import { InsertTab } from './ribbon/InsertTab'
import { LayoutTab } from './ribbon/LayoutTab'
import { ViewTab } from './ribbon/ViewTab'
import { clsx } from 'clsx'

type RibbonTab = 'home' | 'insert' | 'layout' | 'view'

interface RibbonProps {
  editor: CustomEditor
  pageSettings: PageSettings
  onPageSettingsChange: (settings: PageSettings) => void
  zoom: number
  onZoomChange: (zoom: number) => void
}

export const Ribbon = ({
  editor,
  pageSettings,
  onPageSettingsChange,
  zoom,
  onZoomChange,
}: RibbonProps) => {
  const [activeTab, setActiveTab] = useState<RibbonTab>('home')

  const tabs: { id: RibbonTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'insert', label: 'Insert' },
    { id: 'layout', label: 'Layout' },
    { id: 'view', label: 'View' },
  ]

  return (
    <div className="bg-ribbon-bg border-b border-ribbon-border">
      {/* Tab Headers */}
      <div className="flex gap-1 px-2 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-t transition-colors',
              activeTab === tab.id
                ? 'bg-white text-word-blue border-t border-l border-r border-ribbon-border'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white border-t border-ribbon-border">
        <Slate editor={editor} initialValue={[]}>
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'insert' && <InsertTab />}
          {activeTab === 'layout' && (
            <LayoutTab
              pageSettings={pageSettings}
              onPageSettingsChange={onPageSettingsChange}
            />
          )}
          {activeTab === 'view' && <ViewTab zoom={zoom} onZoomChange={onZoomChange} />}
        </Slate>
      </div>
    </div>
  )
}
