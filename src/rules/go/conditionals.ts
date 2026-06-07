export function simplifyGoConditionals(code: string): { code: string; count: number } {
  let count = 0
  const result = code
    .replace(/\bif\s+([\w.]+)\s*==\s*true\s*\{/g, (_, name) => { count++; return `if ${name} {` })
    .replace(/\bif\s+([\w.]+)\s*==\s*false\s*\{/g, (_, name) => { count++; return `if !${name} {` })
    .replace(/\bfor\s+([\w.]+)\s*==\s*true\s*\{/g, (_, name) => { count++; return `for ${name} {` })

  return { code: result, count }
}
