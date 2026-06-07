import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { File } from '@babel/types'

export function removeAiPatterns(ast: File): number {
  let count = 0

  traverse(ast, {
    BlockStatement(path) {
      const stmts = path.node.body
      if (stmts.length !== 2) return

      const [first, second] = stmts
      if (!t.isVariableDeclaration(first) || first.declarations.length !== 1) return
      if (!t.isReturnStatement(second)) return

      const decl = first.declarations[0]
      if (!t.isIdentifier(decl.id) || !decl.init) return
      if (!second.argument) return

      if (t.isAwaitExpression(decl.init) && t.isAwaitExpression(second.argument)) {
        if (t.isCallExpression(decl.init.argument) && t.isCallExpression(second.argument.argument)) {
          const initCall = decl.init.argument
          const retCall = second.argument.argument
          if (callsMatch(initCall, retCall)) {
            path.replaceWith(t.returnStatement(t.awaitExpression(retCall)))
            count++
            return
          }
        }
      }

      if (expressionsMatch(decl.init, second.argument)) {
        path.replaceWith(t.returnStatement(second.argument))
        count++
      }
    },
  })

  return count
}

function callsMatch(a: t.CallExpression, b: t.CallExpression): boolean {
  return JSON.stringify(a.callee) === JSON.stringify(b.callee) &&
    a.arguments.length === b.arguments.length
}

function expressionsMatch(a: t.Expression, b: t.Expression): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
