import traverse from '@babel/traverse'
import type { File } from '@babel/types'

const SUFFIXES = ['Authentication', 'Implementation', 'Configuration', 'Information', 'Management', 'Handler', 'Wrapper', 'Helper']

export function shortenVerboseNames(ast: File, threshold: number): number {
  let count = 0
  const renames = new Map<string, string>()

  traverse(ast, {
    Identifier(path) {
      if (!path.isBindingIdentifier()) return
      const name = path.node.name
      if (name.length <= threshold) return
      for (const suffix of SUFFIXES) {
        if (name.endsWith(suffix) && name.length > suffix.length + 3) {
          const shorter = name.slice(0, -suffix.length)
          if (shorter.length >= 3 && !renames.has(name)) {
            renames.set(name, shorter)
            count++
          }
          break
        }
      }
    },
  })

  if (renames.size === 0) return 0

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name
      if (renames.has(name)) {
        path.node.name = renames.get(name)!
      }
    },
  })

  return count
}
