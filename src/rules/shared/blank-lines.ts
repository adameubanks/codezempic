export function normalizeBlankLines(code: string): string {
  return code
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
}

export function normalizeIndentation(code: string): string {
  const lines = code.split('\n')
  const usesTabs = lines.some((l) => l.startsWith('\t'))
  if (usesTabs) {
    return lines.map((l) => l.replace(/\t/g, '  ')).join('\n')
  }
  return code
}

export function applyBlankLineRules(code: string): string {
  return normalizeIndentation(normalizeBlankLines(code))
}
