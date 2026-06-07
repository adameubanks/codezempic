export function stripJsComments(code: string): string {
  let result = ''
  let i = 0
  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      if (shouldPreserveDirective(code, i)) {
        const lineEnd = code.indexOf('\n', i)
        if (lineEnd === -1) {
          result += code.slice(i)
          break
        }
        result += code.slice(i, lineEnd + 1)
        i = lineEnd + 1
        continue
      }
      const lineEnd = code.indexOf('\n', i)
      if (lineEnd === -1) break
      i = lineEnd
      continue
    }
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2)
      if (end === -1) break
      i = end + 2
      continue
    }
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const end = readStringEnd(code, i)
      result += code.slice(i, end)
      i = end
      continue
    }
    result += code[i]
    i++
  }
  return result
}

function shouldPreserveDirective(code: string, pos: number): boolean {
  const lineStart = code.lastIndexOf('\n', pos - 1) + 1
  const before = code.slice(lineStart, pos).trim()
  if (before !== '' && before !== ';' && before !== '{') return false
  const rest = code.slice(pos)
  return /^\/\/\s*@(ts-|jsx|flow|type)/.test(rest) || /^\/\/\s*!/.test(rest)
}

function readStringEnd(code: string, start: number): number {
  const quote = code[start]
  let i = start + 1
  while (i < code.length) {
    if (code[i] === '\\') {
      i += 2
      continue
    }
    if (code[i] === quote) return i + 1
    if (quote === '`' && code[i] === '$' && code[i + 1] === '{') {
      i += 2
      let depth = 1
      while (i < code.length && depth > 0) {
        if (code[i] === '{') depth++
        if (code[i] === '}') depth--
        if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
          i = readStringEnd(code, i)
          continue
        }
        i++
      }
      continue
    }
    i++
  }
  return code.length
}

export function stripPythonComments(code: string): string {
  const lines = code.split('\n')
  return lines
    .map((line) => {
      let inStr: string | null = null
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (inStr) {
          if (ch === '\\') { i++; continue }
          if (ch === inStr) inStr = null
          continue
        }
        if (ch === '"' || ch === "'") {
          const triple = line.slice(i, i + 3) === ch.repeat(3)
          if (triple) {
            inStr = ch.repeat(3)
            i += 2
            continue
          }
          inStr = ch
          continue
        }
        if (ch === '#') return line.slice(0, i).trimEnd()
      }
      return line
    })
    .join('\n')
}

export function stripRubyComments(code: string): string {
  const withoutBlocks = code.replace(/^=begin[\s\S]*?^=end\s*$/gm, '')
  return stripPythonComments(withoutBlocks)
}
