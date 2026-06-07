export function simplifyPythonConditionals(code: string): { code: string; count: number } {
  let count = 0
  const result = code
    .replace(/\bif\s+(\w+)\s*==\s*True\s*:/g, (_, name) => { count++; return `if ${name}:` })
    .replace(/\bif\s+(\w+)\s*==\s*False\s*:/g, (_, name) => { count++; return `if not ${name}:` })
    .replace(/\bif\s+(\w+)\s+is\s+not\s+None\s+and\s+\1\s+is\s+not\s+None\s*:/g, (_, name) => { count++; return `if ${name} is not None:` })
    .replace(/\bwhile\s+(\w+)\s*==\s*True\s*:/g, (_, name) => { count++; return `while ${name}:` })

  return { code: result, count }
}
