import traverse from '@babel/traverse'
import type { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import type { File } from '@babel/types'

export function removeUnusedImports(ast: File): number {
  let count = 0
  const bindings = new Map<string, boolean>()

  traverse(ast, {
    Program(path) {
      const specifiers: { local: string; path: NodePath }[] = []

      for (const stmt of path.get('body')) {
        if (stmt.isImportDeclaration()) {
          for (const spec of stmt.get('specifiers')) {
            if (t.isImportDefaultSpecifier(spec.node)) {
              specifiers.push({ local: spec.node.local.name, path: spec })
            } else if (t.isImportSpecifier(spec.node)) {
              specifiers.push({ local: spec.node.local.name, path: spec })
            } else if (t.isImportNamespaceSpecifier(spec.node)) {
              specifiers.push({ local: spec.node.local.name, path: spec })
            }
          }
        }
      }

      for (const { local } of specifiers) bindings.set(local, false)

      path.traverse({
        Identifier(innerPath) {
          if (!innerPath.isReferencedIdentifier()) return
          const name = innerPath.node.name
          if (bindings.has(name)) bindings.set(name, true)
        },
      })

      for (const stmt of [...path.get('body')]) {
        if (!stmt.isImportDeclaration()) continue
        const specs = stmt.get('specifiers')
        const unused = specs.filter((s) => {
          const local = s.node.local.name
          return bindings.has(local) && !bindings.get(local)
        })
        if (unused.length === specs.length) {
          stmt.remove()
          count += specs.length
        } else if (unused.length > 0) {
          for (const u of unused) {
            u.remove()
            count++
          }
        }
      }
    },
  })

  return count
}
