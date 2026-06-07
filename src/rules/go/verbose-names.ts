const SUFFIXES = ['Authentication', 'Implementation', 'Configuration', 'Information', 'Management', 'Handler', 'Wrapper', 'Helper']

export function shortenGoNames(code: string, threshold: number): { code: string; count: number } {
  let count = 0
  const renames = new Map<string, string>()
  const idRegex = /\b([a-zA-Z_][a-zA-Z0-9_]{11,})\b/g
  let match
  while ((match = idRegex.exec(code)) !== null) {
    const name = match[1]
    if (name.length <= threshold) continue
    for (const suffix of SUFFIXES) {
      if (name.endsWith(suffix) && name.length > suffix.length + 3) {
        const shorter = name.slice(0, -suffix.length)
        if (!renames.has(name)) {
          renames.set(name, shorter)
          count++
        }
        break
      }
    }
  }

  let result = code
  for (const [from, to] of renames) {
    result = result.replace(new RegExp(`\\b${from}\\b`, 'g'), to)
  }
  return { code: result, count }
}
