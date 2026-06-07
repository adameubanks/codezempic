function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function removeUnusedRubyImports(code: string): { code: string; count: number } {
  const lines = code.split('\n')
  let count = 0
  const toRemove = new Set<number>()

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    const reqMatch = trimmed.match(/^require(?:_relative)?\s+['"]([^'"]+)['"]/)
    if (!reqMatch) return
    const path = reqMatch[1]
    const name = path.split('/').pop()!.replace(/\.rb$/, '')
    const body = lines.join('\n').replace(line, '')
    if (!new RegExp(`\\b${escapeRegex(name)}\\b`).test(body)) {
      toRemove.add(index)
      count++
    }
  })

  return { code: lines.filter((_, i) => !toRemove.has(i)).join('\n'), count }
}
