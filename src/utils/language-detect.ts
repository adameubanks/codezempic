import type { Language } from '../rules/profiles'

export function detectFromExtension(filename: string): Language | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'py') return 'python'
  if (ext === 'go') return 'go'
  if (ext === 'rb') return 'ruby'
  if (ext === 'ts' || ext === 'tsx') return 'typescript'
  if (ext === 'js' || ext === 'jsx' || ext === 'mjs' || ext === 'cjs') return 'javascript'
  return null
}

export function detectFromContent(code: string): Language | null {
  const sample = code.slice(0, 2000)
  if (/^package\s+\w+/m.test(sample) || (/\bfunc\s+\w+\s*\(/.test(sample) && /:=/.test(sample))) {
    return 'go'
  }
  if (/\bdef\s+[a-zA-Z_]\w*\([^)]*\)\s*:/.test(sample) || /^from\s+\w+\s+import/m.test(sample)) {
    if (!/\bend\b/.test(sample)) return 'python'
  }
  if (/\bdef\s+\w+/.test(sample) && /\bend\b/.test(sample) && !/^import\s+\w+/m.test(sample)) {
    return 'ruby'
  }
  if (/\bdef\s+\w+\s*\(/.test(sample) || /^from\s+\w+\s+import/m.test(sample) || (/^import\s+\w+/m.test(sample) && /\bprint\s*\(/.test(sample))) {
    if (!/\b(function|const|let|var|=>)\b/.test(sample)) return 'python'
  }
  if (/\b(interface|type)\s+\w+/.test(sample) || /:\s*(string|number|boolean|void|any)\b/.test(sample)) {
    return 'typescript'
  }
  if (/\b(function|const|let|var|=>|import\s+.*from)\b/.test(sample)) {
    return 'javascript'
  }
  return null
}

export function detectLanguage(code: string, filename?: string): Language {
  if (filename) {
    const fromExt = detectFromExtension(filename)
    if (fromExt) return fromExt
  }
  return detectFromContent(code) ?? 'javascript'
}

export function prismLanguage(lang: Language): string {
  if (lang === 'python') return 'python'
  if (lang === 'go') return 'go'
  if (lang === 'ruby') return 'ruby'
  if (lang === 'typescript') return 'typescript'
  return 'javascript'
}
