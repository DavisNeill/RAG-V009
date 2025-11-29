import { Descendant, Element as SlateElement, Text } from 'slate'
import { FormatRule, ValidationResult, CustomElement, CustomText } from '@/types'

/**
 * Validation Engine
 * Compares student's document against expected formatting rules
 */

export class ValidationEngine {
  /**
   * Validate a document against a set of format rules
   */
  static validateDocument(
    document: Descendant[],
    rules: FormatRule[]
  ): ValidationResult[] {
    const results: ValidationResult[] = []

    for (const rule of rules) {
      const result = this.validateRule(document, rule)
      results.push(result)
    }

    return results
  }

  /**
   * Validate a single rule
   */
  private static validateRule(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    switch (rule.type) {
      case 'text':
        return this.validateTextFormat(document, rule)
      case 'paragraph':
        return this.validateParagraphFormat(document, rule)
      case 'list':
        return this.validateListFormat(document, rule)
      case 'table':
        return this.validateTableFormat(document, rule)
      case 'image':
        return this.validateImageFormat(document, rule)
      default:
        return {
          ruleId: `rule-${Date.now()}`,
          passed: false,
          message: 'Unknown rule type',
          points: 0,
        }
    }
  }

  /**
   * Validate text formatting (bold, italic, font, etc.)
   */
  private static validateTextFormat(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    const { selector, properties, points = 0 } = rule
    let passed = false
    let message = ''

    // Find text matching the selector
    const matchingTexts = this.findTextNodes(document, selector)

    if (matchingTexts.length === 0) {
      message = selector
        ? `Text "${selector}" not found in document`
        : 'No text found to validate'
      return { ruleId: `rule-${Date.now()}`, passed: false, message, points: 0 }
    }

    // Check if all matching texts have the required properties
    const allMatch = matchingTexts.every(text => {
      return this.checkTextProperties(text, properties)
    })

    if (allMatch) {
      passed = true
      message = `Text formatting correct: ${this.formatPropertyList(properties)}`
    } else {
      message = `Text formatting incorrect. Expected: ${this.formatPropertyList(properties)}`
    }

    return {
      ruleId: `rule-${Date.now()}`,
      passed,
      message,
      points: passed ? points : 0,
    }
  }

  /**
   * Validate paragraph formatting
   */
  private static validateParagraphFormat(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    const { selector, properties, points = 0 } = rule
    let passed = false
    let message = ''

    const paragraphs = this.findElements(document, 'paragraph')

    if (paragraphs.length === 0) {
      message = 'No paragraphs found in document'
      return { ruleId: `rule-${Date.now()}`, passed: false, message, points: 0 }
    }

    // If selector is provided, find paragraphs containing that text
    const targetParagraphs = selector
      ? paragraphs.filter(p => this.elementContainsText(p, selector))
      : paragraphs

    if (targetParagraphs.length === 0) {
      message = selector
        ? `Paragraph containing "${selector}" not found`
        : 'No paragraphs to validate'
      return { ruleId: `rule-${Date.now()}`, passed: false, message, points: 0 }
    }

    // Check if paragraphs have required properties
    const allMatch = targetParagraphs.every(p => {
      return this.checkElementProperties(p, properties)
    })

    if (allMatch) {
      passed = true
      message = `Paragraph formatting correct: ${this.formatPropertyList(properties)}`
    } else {
      message = `Paragraph formatting incorrect. Expected: ${this.formatPropertyList(properties)}`
    }

    return {
      ruleId: `rule-${Date.now()}`,
      passed,
      message,
      points: passed ? points : 0,
    }
  }

  /**
   * Validate list formatting
   */
  private static validateListFormat(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    const { properties, points = 0 } = rule
    const listType = properties.listType === 'numbered' ? 'numbered-list' : 'bulleted-list'

    const lists = this.findElements(document, listType)

    if (lists.length === 0) {
      return {
        ruleId: `rule-${Date.now()}`,
        passed: false,
        message: `No ${properties.listType} list found`,
        points: 0,
      }
    }

    return {
      ruleId: `rule-${Date.now()}`,
      passed: true,
      message: `${properties.listType} list found`,
      points,
    }
  }

  /**
   * Validate table formatting
   */
  private static validateTableFormat(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    const { properties, points = 0 } = rule
    const tables = this.findElements(document, 'table')

    if (tables.length === 0) {
      return {
        ruleId: `rule-${Date.now()}`,
        passed: false,
        message: 'No table found in document',
        points: 0,
      }
    }

    const table = tables[0] as CustomElement

    if (table.type === 'table') {
      const rows = table.children.length
      const cols = table.children[0]?.children?.length || 0

      const expectedRows = properties.tableRows || 0
      const expectedCols = properties.tableCols || 0

      if (rows >= expectedRows && cols >= expectedCols) {
        return {
          ruleId: `rule-${Date.now()}`,
          passed: true,
          message: `Table found with ${rows}x${cols} dimensions`,
          points,
        }
      } else {
        return {
          ruleId: `rule-${Date.now()}`,
          passed: false,
          message: `Table dimensions incorrect. Expected at least ${expectedRows}x${expectedCols}, got ${rows}x${cols}`,
          points: 0,
        }
      }
    }

    return {
      ruleId: `rule-${Date.now()}`,
      passed: false,
      message: 'Invalid table structure',
      points: 0,
    }
  }

  /**
   * Validate image presence
   */
  private static validateImageFormat(
    document: Descendant[],
    rule: FormatRule
  ): ValidationResult {
    const { points = 0 } = rule
    const images = this.findElements(document, 'image')

    if (images.length === 0) {
      return {
        ruleId: `rule-${Date.now()}`,
        passed: false,
        message: 'No image found in document',
        points: 0,
      }
    }

    return {
      ruleId: `rule-${Date.now()}`,
      passed: true,
      message: `${images.length} image(s) found`,
      points,
    }
  }

  /**
   * Helper: Find all text nodes matching selector
   */
  private static findTextNodes(
    nodes: Descendant[],
    selector?: string
  ): CustomText[] {
    const results: CustomText[] = []

    const traverse = (node: Descendant) => {
      if (Text.isText(node)) {
        const text = node as CustomText
        if (!selector || text.text.includes(selector)) {
          results.push(text)
        }
      } else if (SlateElement.isElement(node)) {
        node.children.forEach(traverse)
      }
    }

    nodes.forEach(traverse)
    return results
  }

  /**
   * Helper: Find elements of specific type
   */
  private static findElements(
    nodes: Descendant[],
    type: string
  ): CustomElement[] {
    const results: CustomElement[] = []

    const traverse = (node: Descendant) => {
      if (SlateElement.isElement(node)) {
        const element = node as CustomElement
        if (element.type === type) {
          results.push(element)
        }
        element.children.forEach(traverse)
      }
    }

    nodes.forEach(traverse)
    return results
  }

  /**
   * Helper: Check if element contains text
   */
  private static elementContainsText(element: CustomElement, text: string): boolean {
    const allText = this.extractText(element)
    return allText.includes(text)
  }

  /**
   * Helper: Extract all text from element
   */
  private static extractText(node: Descendant): string {
    if (Text.isText(node)) {
      return node.text
    } else if (SlateElement.isElement(node)) {
      return node.children.map(child => this.extractText(child)).join('')
    }
    return ''
  }

  /**
   * Helper: Check text properties
   */
  private static checkTextProperties(
    text: CustomText,
    properties: Record<string, any>
  ): boolean {
    for (const [key, value] of Object.entries(properties)) {
      if (key === 'bold' || key === 'italic' || key === 'underline' || key === 'strikethrough') {
        if (text[key] !== value) return false
      } else if (key === 'fontSize' || key === 'fontFamily' || key === 'color') {
        if (text[key as keyof CustomText] !== value) return false
      }
    }
    return true
  }

  /**
   * Helper: Check element properties
   */
  private static checkElementProperties(
    element: CustomElement,
    properties: Record<string, any>
  ): boolean {
    for (const [key, value] of Object.entries(properties)) {
      if (key === 'align') {
        if ('align' in element && element.align !== value) return false
      }
    }
    return true
  }

  /**
   * Helper: Format property list for display
   */
  private static formatPropertyList(properties: Record<string, any>): string {
    return Object.entries(properties)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }

  /**
   * Calculate total score
   */
  static calculateScore(results: ValidationResult[]): {
    score: number
    maxScore: number
    percentage: number
  } {
    const score = results.reduce((sum, r) => sum + r.points, 0)
    const maxScore = results.reduce((sum, r) => sum + (r.points || 0), 0)
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0

    return { score, maxScore, percentage }
  }
}
