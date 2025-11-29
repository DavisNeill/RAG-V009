import { useState } from 'react'
import { useSlate } from 'slate-react'
import { Table, Image, FileImage } from 'lucide-react'
import { RibbonButton, RibbonGroup, RibbonInput } from '../RibbonButton'
import { insertTable, insertImage } from '@/utils/slateUtils'

export const InsertTab = () => {
  const editor = useSlate()
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [imageUrl, setImageUrl] = useState('')

  const handleInsertTable = () => {
    insertTable(editor, tableRows, tableCols)
    setShowTableDialog(false)
  }

  const handleInsertImage = () => {
    if (imageUrl) {
      insertImage(editor, imageUrl)
      setImageUrl('')
      setShowImageDialog(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        insertImage(editor, url)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <RibbonGroup label="Tables">
        <RibbonButton
          icon={<Table size={16} />}
          label="Table"
          onClick={() => setShowTableDialog(!showTableDialog)}
        />
      </RibbonGroup>

      <RibbonGroup label="Images">
        <RibbonButton
          icon={<Image size={16} />}
          label="Image URL"
          onClick={() => setShowImageDialog(!showImageDialog)}
        />
        <label className="cursor-pointer">
          <RibbonButton
            as="div"
            icon={<FileImage size={16} />}
            label="Upload"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </RibbonGroup>

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Insert Table</h3>
            <div className="flex gap-4 mb-4">
              <RibbonInput
                type="number"
                label="Rows"
                value={tableRows}
                onChange={(e) => setTableRows(Number(e.target.value))}
                min="1"
                max="20"
              />
              <RibbonInput
                type="number"
                label="Columns"
                value={tableCols}
                onChange={(e) => setTableCols(Number(e.target.value))}
                min="1"
                max="10"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowTableDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertTable}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowImageDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
