import { diffLines } from 'diff'

export interface DiffLine {
  type: 'unchanged' | 'added' | 'removed'
  content: string
}

export interface DiffHunk {
  id: number
  before: string[]
  after: string[]
}

export type DiffSegment =
  | { type: 'unchanged'; lines: string[] }
  | { type: 'hunk'; hunk: DiffHunk }

export function computeLineDiff(before: string, after: string): DiffLine[] {
  const changes = diffLines(before, after)
  const result: DiffLine[] = []

  for (const change of changes) {
    const lines = change.value.replace(/\n$/, '').split('\n')
    const type = change.added ? 'added' : change.removed ? 'removed' : 'unchanged'
    for (const line of lines) {
      if (line === '' && !change.value.includes('\n')) continue
      result.push({ type, content: line })
    }
  }

  return result
}

export function computeDiffSegments(before: string, after: string): DiffSegment[] {
  const lines = computeLineDiff(before, after)
  const segments: DiffSegment[] = []
  let i = 0
  let hunkId = 0

  while (i < lines.length) {
    if (lines[i].type === 'unchanged') {
      const unchanged: string[] = []
      while (i < lines.length && lines[i].type === 'unchanged') {
        unchanged.push(lines[i].content)
        i++
      }
      segments.push({ type: 'unchanged', lines: unchanged })
    } else {
      const hunkBefore: string[] = []
      const hunkAfter: string[] = []
      while (i < lines.length && lines[i].type !== 'unchanged') {
        if (lines[i].type === 'removed') hunkBefore.push(lines[i].content)
        if (lines[i].type === 'added') hunkAfter.push(lines[i].content)
        i++
      }
      segments.push({ type: 'hunk', hunk: { id: hunkId++, before: hunkBefore, after: hunkAfter } })
    }
  }

  return segments
}

export function buildCodeFromSegments(
  segments: DiffSegment[],
  rejectedHunks: Set<number>
): string {
  const result: string[] = []
  for (const segment of segments) {
    if (segment.type === 'unchanged') {
      result.push(...segment.lines)
    } else {
      result.push(...(rejectedHunks.has(segment.hunk.id) ? segment.hunk.before : segment.hunk.after))
    }
  }
  return result.join('\n')
}

export function getDiffHunks(segments: DiffSegment[]): DiffHunk[] {
  return segments.filter((s): s is { type: 'hunk'; hunk: DiffHunk } => s.type === 'hunk').map((s) => s.hunk)
}
