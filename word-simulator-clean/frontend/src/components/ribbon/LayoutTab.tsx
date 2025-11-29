import { useState } from 'react'
import { FileText, Smartphone } from 'lucide-react'
import { RibbonButton, RibbonGroup, RibbonInput } from '../RibbonButton'
import { PageSettings } from '@/types'

interface LayoutTabProps {
  pageSettings: PageSettings
  onPageSettingsChange: (settings: PageSettings) => void
}

export const LayoutTab = ({ pageSettings, onPageSettingsChange }: LayoutTabProps) => {
  const [showMarginDialog, setShowMarginDialog] = useState(false)

  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    if (orientation === 'landscape') {
      onPageSettingsChange({
        ...pageSettings,
        orientation,
        width: 1056,
        height: 816,
      })
    } else {
      onPageSettingsChange({
        ...pageSettings,
        orientation,
        width: 816,
        height: 1056,
      })
    }
  }

  const handleMarginChange = (margin: keyof PageSettings, value: number) => {
    onPageSettingsChange({
      ...pageSettings,
      [margin]: value,
    })
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <RibbonGroup label="Page Setup">
        <RibbonButton
          active={pageSettings.orientation === 'portrait'}
          icon={<FileText size={16} />}
          label="Portrait"
          onClick={() => handleOrientationChange('portrait')}
        />
        <RibbonButton
          active={pageSettings.orientation === 'landscape'}
          icon={<Smartphone size={16} className="rotate-90" />}
          label="Landscape"
          onClick={() => handleOrientationChange('landscape')}
        />
      </RibbonGroup>

      <RibbonGroup label="Margins">
        <RibbonButton
          label="Custom Margins"
          onClick={() => setShowMarginDialog(!showMarginDialog)}
        />
      </RibbonGroup>

      {/* Margin Dialog */}
      {showMarginDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Page Margins</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <RibbonInput
                type="number"
                label="Top (px)"
                value={pageSettings.marginTop}
                onChange={(e) => handleMarginChange('marginTop', Number(e.target.value))}
                min="0"
              />
              <RibbonInput
                type="number"
                label="Bottom (px)"
                value={pageSettings.marginBottom}
                onChange={(e) => handleMarginChange('marginBottom', Number(e.target.value))}
                min="0"
              />
              <RibbonInput
                type="number"
                label="Left (px)"
                value={pageSettings.marginLeft}
                onChange={(e) => handleMarginChange('marginLeft', Number(e.target.value))}
                min="0"
              />
              <RibbonInput
                type="number"
                label="Right (px)"
                value={pageSettings.marginRight}
                onChange={(e) => handleMarginChange('marginRight', Number(e.target.value))}
                min="0"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowMarginDialog(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
