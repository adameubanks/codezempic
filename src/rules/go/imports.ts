function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function goImportNames(line: string): string[] {
  const trimmed = line.trim().replace(/^import\s*/, '')
  const aliasMatch = trimmed.match(/^(\w+)\s+"([^"]+)"$/)
  if (aliasMatch) return [aliasMatch[1]]
  const quoted = trimmed.match(/^"([^"]+)"$/)
  if (quoted) return [quoted[1].split('/').pop()!]
  return [...trimmed.matchAll(/(?:(\w+)\s+)?"([^"]+)"/g)].map((m) => m[1] ?? m[2].split('/').pop()!)
}

function isNameUsed(body: string, name: string): boolean {
  return new RegExp(`\\b${escapeRegex(name)}(?:\\.|\\b)`).test(body)
}

export function removeUnusedGoImports(code: string): { code: string; count: number } {
  const lines = code.split('\n')
  let count = 0
  const toRemove = new Set<number>()

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith('import "') || /^import\s+\w+\s+"/.test(trimmed)) {
      const names = goImportNames(trimmed)
      const body = lines.filter((_, idx) => idx !== i).join('\n')
      if (names.every((name) => !isNameUsed(body, name))) {
        toRemove.add(i)
        count += names.length
      }
      continue
    }
    if (trimmed !== 'import (' && !trimmed.startsWith('import (')) continue

    const start = i
    let end = i
    while (end < lines.length && !lines[end].trim().startsWith(')')) end++
    const inner = lines.slice(start + 1, end).filter((l) => l.trim() && !l.trim().startsWith('//'))
    const kept = inner.filter((line) => {
      const names = goImportNames(line)
      const body = lines.filter((_, idx) => idx < start || idx > end || line !== lines[idx]).join('\n')
      return names.some((name) => isNameUsed(body, name))
    })

    if (kept.length === 0) {
      for (let j = start; j <= end; j++) toRemove.add(j)
      count += inner.length
    } else if (kept.length < inner.length) {
      count += inner.length - kept.length
      if (kept.length === 1) {
        lines[start] = `import ${kept[0].trim()}`
        for (let j = start + 1; j <= end; j++) toRemove.add(j)
      } else {
        for (let j = start + 1; j < end; j++) {
          if (!kept.includes(lines[j])) toRemove.add(j)
        }
      }
    }
    i = end
  }

  return { code: lines.filter((_, i) => !toRemove.has(i)).join('\n'), count }
}
