import { useSlate } from 'slate-react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from 'lucide-react'
import { RibbonButton, RibbonSelect, RibbonInput, RibbonDivider, RibbonGroup } from '../RibbonButton'
import {
  toggleMark,
  setTextProperty,
  setAlignment,
  toggleBlock,
  isMarkActive,
  isBlockActive,
  getCurrentAlignment,
  getCurrentFormat,
} from '@/utils/slateUtils'

const FONT_FAMILIES = [
  'Calibri',
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
]

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72]

export const HomeTab = () => {
  const editor = useSlate()
  const currentFormat = getCurrentFormat(editor)
  const currentAlign = getCurrentAlignment(editor)

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {/* Font Controls */}
      <RibbonGroup label="Font">
        <RibbonSelect
          value={currentFormat.fontFamily}
          onChange={(e) => setTextProperty(editor, 'fontFamily', e.target.value)}
          className="w-40"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </RibbonSelect>

        <RibbonSelect
          value={currentFormat.fontSize}
          onChange={(e) => setTextProperty(editor, 'fontSize', Number(e.target.value))}
          className="w-20"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </RibbonSelect>

        <RibbonButton
          active={isMarkActive(editor, 'bold')}
          icon={<Bold size={16} />}
          title="Bold (Ctrl+B)"
          onClick={() => toggleMark(editor, 'bold')}
        />
        <RibbonButton
          active={isMarkActive(editor, 'italic')}
          icon={<Italic size={16} />}
          title="Italic (Ctrl+I)"
          onClick={() => toggleMark(editor, 'italic')}
        />
        <RibbonButton
          active={isMarkActive(editor, 'underline')}
          icon={<Underline size={16} />}
          title="Underline (Ctrl+U)"
          onClick={() => toggleMark(editor, 'underline')}
        />
        <RibbonButton
          active={isMarkActive(editor, 'strikethrough')}
          icon={<Strikethrough size={16} />}
          title="Strikethrough"
          onClick={() => toggleMark(editor, 'strikethrough')}
        />

        <div className="flex items-center gap-1">
          <input
            type="color"
            value={currentFormat.color}
            onChange={(e) => setTextProperty(editor, 'color', e.target.value)}
            className="w-8 h-8 cursor-pointer"
            title="Text Color"
          />
          <input
            type="color"
            value={currentFormat.backgroundColor === 'transparent' ? '#ffffff' : currentFormat.backgroundColor}
            onChange={(e) => setTextProperty(editor, 'backgroundColor', e.target.value)}
            className="w-8 h-8 cursor-pointer"
            title="Background Color"
          />
        </div>
      </RibbonGroup>

      <RibbonDivider />

      {/* Paragraph Controls */}
      <RibbonGroup label="Paragraph">
        <RibbonButton
          active={currentAlign === 'left'}
          icon={<AlignLeft size={16} />}
          title="Align Left"
          onClick={() => setAlignment(editor, 'left')}
        />
        <RibbonButton
          active={currentAlign === 'center'}
          icon={<AlignCenter size={16} />}
          title="Align Center"
          onClick={() => setAlignment(editor, 'center')}
        />
        <RibbonButton
          active={currentAlign === 'right'}
          icon={<AlignRight size={16} />}
          title="Align Right"
          onClick={() => setAlignment(editor, 'right')}
        />
        <RibbonButton
          active={currentAlign === 'justify'}
          icon={<AlignJustify size={16} />}
          title="Justify"
          onClick={() => setAlignment(editor, 'justify')}
        />
      </RibbonGroup>

      <RibbonDivider />

      {/* List Controls */}
      <RibbonGroup label="Lists">
        <RibbonButton
          active={isBlockActive(editor, 'bulleted-list')}
          icon={<List size={16} />}
          title="Bulleted List"
          onClick={() => toggleBlock(editor, 'bulleted-list')}
        />
        <RibbonButton
          active={isBlockActive(editor, 'numbered-list')}
          icon={<ListOrdered size={16} />}
          title="Numbered List"
          onClick={() => toggleBlock(editor, 'numbered-list')}
        />
      </RibbonGroup>
    </div>
  )
}
