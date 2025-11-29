import { useCallback, useMemo, useState } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor, CustomElement, CustomText, PageSettings, DEFAULT_PAGE_SETTINGS } from '@/types'
import { initialValue } from '@/utils/slateUtils'

interface DocumentEditorProps {
  value?: Descendant[]
  onChange?: (value: Descendant[]) => void
  pageSettings?: PageSettings
  readOnly?: boolean
}

const DocumentEditor = ({
  value,
  onChange,
  pageSettings = DEFAULT_PAGE_SETTINGS,
  readOnly = false
}: DocumentEditorProps) => {
  const [editorValue, setEditorValue] = useState<Descendant[]>(value || initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor() as CustomEditor)), [])

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  const handleChange = (newValue: Descendant[]) => {
    setEditorValue(newValue)
    onChange?.(newValue)
  }

  const pageStyle = {
    width: `${pageSettings.width}px`,
    minHeight: `${pageSettings.height}px`,
    paddingTop: `${pageSettings.marginTop}px`,
    paddingBottom: `${pageSettings.marginBottom}px`,
    paddingLeft: `${pageSettings.marginLeft}px`,
    paddingRight: `${pageSettings.marginRight}px`,
  }

  return (
    <div className="w-full h-full flex justify-center bg-gray-200 overflow-y-auto document-scrollbar">
      <div className="my-8">
        <div
          className="bg-white page-shadow"
          style={pageStyle}
        >
          <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Start typing your document..."
              spellCheck
              autoFocus
              readOnly={readOnly}
              className="outline-none min-h-full"
            />
          </Slate>
        </div>
      </div>
    </div>
  )
}

// Element renderer
const Element = ({ attributes, children, element }: RenderElementProps) => {
  const style: React.CSSProperties = {}

  if ('align' in element) {
    style.textAlign = element.align
  }

  switch (element.type) {
    case 'heading':
      const level = (element as any).level || 1
      const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
      const headingSizes = {
        1: 'text-4xl',
        2: 'text-3xl',
        3: 'text-2xl',
        4: 'text-xl',
        5: 'text-lg',
        6: 'text-base',
      }
      return (
        <HeadingTag {...attributes} className={`font-bold ${headingSizes[level as keyof typeof headingSizes]}`} style={style}>
          {children}
        </HeadingTag>
      )

    case 'bulleted-list':
      return (
        <ul {...attributes} className="list-disc ml-8" style={style}>
          {children}
        </ul>
      )

    case 'numbered-list':
      return (
        <ol {...attributes} className="list-decimal ml-8" style={style}>
          {children}
        </ol>
      )

    case 'list-item':
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      )

    case 'table':
      return (
        <table {...attributes} className="border-collapse border border-gray-400 my-4">
          <tbody>{children}</tbody>
        </table>
      )

    case 'table-row':
      return <tr {...attributes}>{children}</tr>

    case 'table-cell':
      return (
        <td {...attributes} className="border border-gray-400 p-2 min-w-[100px]">
          {children}
        </td>
      )

    case 'image':
      const imageElement = element as any
      return (
        <div {...attributes} contentEditable={false} className="my-4">
          <img
            src={imageElement.url}
            alt="Document image"
            style={{
              width: imageElement.width || 'auto',
              height: imageElement.height || 'auto',
              maxWidth: '100%',
            }}
          />
          {children}
        </div>
      )

    default:
      return (
        <p {...attributes} className="min-h-[1.5em]" style={style}>
          {children}
        </p>
      )
  }
}

// Leaf renderer (text formatting)
const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const customLeaf = leaf as CustomText
  let styledChildren = children

  const style: React.CSSProperties = {
    fontWeight: customLeaf.bold ? 'bold' : 'normal',
    fontStyle: customLeaf.italic ? 'italic' : 'normal',
    textDecoration: [
      customLeaf.underline ? 'underline' : '',
      customLeaf.strikethrough ? 'line-through' : '',
    ].filter(Boolean).join(' ') || 'none',
    fontSize: customLeaf.fontSize ? `${customLeaf.fontSize}pt` : undefined,
    fontFamily: customLeaf.fontFamily || undefined,
    color: customLeaf.color || undefined,
    backgroundColor: customLeaf.backgroundColor || undefined,
  }

  return (
    <span {...attributes} style={style}>
      {styledChildren}
    </span>
  )
}

export default DocumentEditor
