import { Editor, Transforms, Element as SlateElement, BaseEditor, Descendant } from 'slate'
import { CustomEditor, CustomElement } from '@/types'

// Check if a format is currently active
export const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format as keyof typeof marks] === true : false
}

// Toggle a text format (bold, italic, etc.)
export const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

// Set a text property (fontSize, fontFamily, color)
export const setTextProperty = (editor: CustomEditor, property: string, value: any) => {
  Editor.addMark(editor, property, value)
}

// Check if a block type is active
export const isBlockActive = (
  editor: CustomEditor,
  format: string,
  blockType: keyof CustomElement = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

// Toggle a block type
export const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = ['numbered-list', 'bulleted-list'].includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['numbered-list', 'bulleted-list'].includes(n.type),
    split: true,
  })

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : (format as any),
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format as 'bulleted-list' | 'numbered-list', children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

// Set text alignment
export const setAlignment = (editor: CustomEditor, align: 'left' | 'center' | 'right' | 'justify') => {
  Transforms.setNodes(
    editor,
    { align } as Partial<SlateElement>,
    { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
  )
}

// Insert a table
export const insertTable = (editor: CustomEditor, rows: number, cols: number) => {
  const table: CustomElement = {
    type: 'table',
    children: Array.from({ length: rows }, () => ({
      type: 'table-row' as const,
      children: Array.from({ length: cols }, () => ({
        type: 'table-cell' as const,
        children: [{ text: '' }],
      })),
    })),
  }

  Transforms.insertNodes(editor, table)
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  })
}

// Insert an image
export const insertImage = (editor: CustomEditor, url: string) => {
  const image: CustomElement = {
    type: 'image',
    url,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, image)
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  })
}

// Get current format state
export const getCurrentFormat = (editor: CustomEditor) => {
  const marks = Editor.marks(editor) || {}
  return {
    bold: marks.bold || false,
    italic: marks.italic || false,
    underline: marks.underline || false,
    strikethrough: marks.strikethrough || false,
    fontSize: marks.fontSize || 12,
    fontFamily: marks.fontFamily || 'Calibri',
    color: marks.color || '#000000',
    backgroundColor: marks.backgroundColor || 'transparent',
  }
}

// Get current alignment
export const getCurrentAlignment = (editor: CustomEditor): 'left' | 'center' | 'right' | 'justify' => {
  const { selection } = editor
  if (!selection) return 'left'

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
    })
  )

  if (match && SlateElement.isElement(match[0])) {
    const element = match[0] as any
    return element.align || 'left'
  }

  return 'left'
}

// Initial editor value
export const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

// Serialize document to plain text
export const serializeToText = (nodes: Descendant[]): string => {
  return nodes.map(n => SlateElement.isElement(n) ? serializeToText(n.children) : n.text).join('\n')
}

// Create empty paragraph
export const createParagraph = (text: string = ''): CustomElement => ({
  type: 'paragraph',
  children: [{ text }],
})
