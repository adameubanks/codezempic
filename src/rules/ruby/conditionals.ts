export function simplifyRubyConditionals(code: string): { code: string; count: number } {
  let count = 0
  const result = code
    .replace(/\bif\s+(\w+)\s*==\s*true\s*\n?/g, (_, name) => { count++; return `if ${name}\n` })
    .replace(/\bif\s+(\w+)\s*==\s*false\s*\n?/g, (_, name) => { count++; return `unless ${name}\n` })
    .replace(/\bwhile\s+(\w+)\s*==\s*true\s*\n?/g, (_, name) => { count++; return `while ${name}\n` })

  return { code: result, count }
}
