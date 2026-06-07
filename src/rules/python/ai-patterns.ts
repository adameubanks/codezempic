export function removePythonAiPatterns(code: string): { code: string; count: number } {
  let count = 0
  const lines = code.split('\n')
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const next = lines[i + 1]
    const assignMatch = line.match(/^(\s*)(\w+)\s*=\s*(.+)$/)
    if (assignMatch && next) {
      const indent = assignMatch[1]
      const varName = assignMatch[2]
      const expr = assignMatch[3]
      const returnMatch = next.match(new RegExp(`^${indent}return\\s+${varName}\\s*$`))
      if (returnMatch) {
        result.push(`${indent}return ${expr}`)
        i++
        count++
        continue
      }
    }
    result.push(line)
  }

  return { code: result.join('\n'), count }
}
