import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-ruby'
import type { Language } from '../rules/profiles'
import { prismLanguage } from './language-detect'
import type { DiffSegment } from './diff'

function grammarFor(language: Language) {
  const lang = prismLanguage(language)
  return Prism.languages[lang] ?? Prism.languages.javascript
}

function highlightLine(content: string, language: Language): string {
  const text = content.length ? content : ' '
  const lang = prismLanguage(language)
  return Prism.highlight(text, grammarFor(language), lang)
}

function renderLines(lines: string[], className: string, language: Language): string {
  return lines
    .map((line) => `<span class="editor-line ${className}">${highlightLine(line, language)}</span>`)
    .join('')
}

function renderRejectBtn(hunkId: number): string {
  return `<button type="button" class="diff-reject-btn" data-hunk-id="${hunkId}">Reject</button>`
}

function renderPendingHunk(hunkId: number, after: string[], language: Language): string {
  if (after.length === 0) {
    return `<span class="editor-line diff-deletion" data-hunk-id="${hunkId}">${renderRejectBtn(hunkId)}</span>`
  }
  const [first, ...rest] = after
  return `<span class="editor-line diff-changed diff-changed-first" data-hunk-id="${hunkId}">
    <span class="diff-changed-code">${highlightLine(first, language)}</span>${renderRejectBtn(hunkId)}
  </span>${renderLines(rest, 'diff-changed', language)}`
}

export function renderOutputDiff(
  segments: DiffSegment[],
  rejectedHunks: Set<number>,
  language: Language
): string {
  return segments
    .map((segment) => {
      if (segment.type === 'unchanged') {
        return renderLines(segment.lines, '', language)
      }
      const { id, before, after } = segment.hunk
      if (rejectedHunks.has(id)) {
        return renderLines(before, '', language)
      }
      return renderPendingHunk(id, after, language)
    })
    .join('')
}
