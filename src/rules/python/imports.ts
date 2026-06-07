export function removeUnusedPythonImports(code: string): { code: string; count: number } {
  const lines = code.split('\n')
  let count = 0
  const importLines: { index: number; names: string[]; raw: string }[] = []

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    const fromMatch = trimmed.match(/^from\s+(\S+)\s+import\s+(.+)$/)
    if (fromMatch) {
      const names = fromMatch[2].split(',').map((n) => n.trim().split(/\s+as\s+/).pop()!.trim())
      importLines.push({ index, names, raw: line })
      return
    }
    const importMatch = trimmed.match(/^import\s+(.+)$/)
    if (importMatch) {
      const names = importMatch[1].split(',').map((n) => {
        const parts = n.trim().split(/\s+as\s+/)
        return parts.length > 1 ? parts[1] : parts[0].split('.')[0]
      })
      importLines.push({ index, names, raw: line })
    }
  })

  const body = lines.join('\n')
  const toRemove = new Set<number>()

  for (const imp of importLines) {
    const allUnused = imp.names.every((name) => {
      const regex = new RegExp(`\\b${escapeRegex(name)}\\b`)
      const withoutImport = body.replace(imp.raw, '')
      return !regex.test(withoutImport)
    })
    if (allUnused) {
      toRemove.add(imp.index)
      count += imp.names.length
    }
  }

  const result = lines.filter((_, i) => !toRemove.has(i)).join('\n')
  return { code: result, count }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
