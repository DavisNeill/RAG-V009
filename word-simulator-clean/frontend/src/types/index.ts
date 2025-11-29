// Slate.js custom types
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | ImageElement

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
}

export type ParagraphElement = {
  type: 'paragraph'
  align?: 'left' | 'center' | 'right' | 'justify'
  lineHeight?: number
  indent?: number
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: ListItemElement[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  children: ListItemElement[]
}

export type ListItemElement = {
  type: 'list-item'
  children: CustomText[]
}

export type TableElement = {
  type: 'table'
  children: TableRowElement[]
}

export type TableRowElement = {
  type: 'table-row'
  children: TableCellElement[]
}

export type TableCellElement = {
  type: 'table-cell'
  children: CustomText[]
}

export type ImageElement = {
  type: 'image'
  url: string
  width?: number
  height?: number
  children: CustomText[]
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}

// Application types
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  createdAt: Date
}

export interface Task {
  id: string
  testId: string
  title: string
  description: string
  instructions: string[]
  expectedFormat: DocumentFormat
  points: number
  order: number
}

export interface Test {
  id: string
  title: string
  description: string
  duration: number // in minutes
  tasks: Task[]
  createdBy: string
  createdAt: Date
  isActive: boolean
}

export interface DocumentFormat {
  elements: FormatRule[]
}

export interface FormatRule {
  type: 'text' | 'paragraph' | 'list' | 'table' | 'image' | 'header' | 'footer'
  selector?: string // text content to match
  properties: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    fontSize?: number
    fontFamily?: string
    color?: string
    align?: 'left' | 'center' | 'right' | 'justify'
    listType?: 'bulleted' | 'numbered'
    tableRows?: number
    tableCols?: number
    [key: string]: any
  }
  required?: boolean
  points?: number
}

export interface TestAttempt {
  id: string
  testId: string
  userId: string
  startTime: Date
  endTime?: Date
  status: 'in-progress' | 'completed' | 'graded'
  taskResults: TaskResult[]
  totalScore?: number
  maxScore: number
}

export interface TaskResult {
  taskId: string
  document: Descendant[]
  validationResults: ValidationResult[]
  score: number
  maxScore: number
  completedAt: Date
}

export interface ValidationResult {
  ruleId: string
  passed: boolean
  message: string
  points: number
}

export interface EditorState {
  value: Descendant[]
  selection: any
  currentFormat: {
    bold: boolean
    italic: boolean
    underline: boolean
    fontSize: number
    fontFamily: string
    color: string
    align: 'left' | 'center' | 'right' | 'justify'
  }
}

export interface PageSettings {
  width: number // in pixels
  height: number // in pixels
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  orientation: 'portrait' | 'landscape'
}

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  width: 816, // 8.5 inches at 96 DPI
  height: 1056, // 11 inches at 96 DPI
  marginTop: 96, // 1 inch
  marginBottom: 96,
  marginLeft: 96,
  marginRight: 96,
  orientation: 'portrait',
}
