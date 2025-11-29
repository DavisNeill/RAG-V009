import { ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { RibbonButton, RibbonGroup } from '../RibbonButton'

interface ViewTabProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

export const ViewTab = ({ zoom, onZoomChange }: ViewTabProps) => {
  const handleZoomIn = () => {
    if (zoom < 200) {
      onZoomChange(Math.min(200, zoom + 10))
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      onZoomChange(Math.max(50, zoom - 10))
    }
  }

  const handleResetZoom = () => {
    onZoomChange(100)
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <RibbonGroup label="Zoom">
        <RibbonButton
          icon={<ZoomIn size={16} />}
          label="Zoom In"
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        />
        <RibbonButton
          icon={<ZoomOut size={16} />}
          label="Zoom Out"
          onClick={handleZoomOut}
          disabled={zoom <= 50}
        />
        <RibbonButton
          icon={<Maximize size={16} />}
          label={`${zoom}%`}
          onClick={handleResetZoom}
        />
      </RibbonGroup>
    </div>
  )
}
