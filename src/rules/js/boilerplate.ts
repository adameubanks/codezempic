import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { File } from '@babel/types'

export function removeBoilerplate(ast: File): number {
  let count = 0

  traverse(ast, {
    FunctionDeclaration(path) {
      if (!path.node.body.body.length) return
      const body = path.node.body.body
      if (body.length !== 1 || !t.isReturnStatement(body[0])) return
      const ret = body[0]
      if (!ret.argument || !t.isCallExpression(ret.argument)) return
      const params = path.node.params
      if (!params.every((p) => t.isIdentifier(p))) return
      const callArgs = ret.argument.arguments
      if (callArgs.length !== params.length) return
      const allMatch = params.every((p, i) => {
        const arg = callArgs[i]
        return t.isIdentifier(p) && t.isIdentifier(arg) && p.name === arg.name
      })
      if (!allMatch) return
      if (t.isIdentifier(ret.argument.callee)) {
        const wrapperName = path.node.id?.name
        if (wrapperName) count++
      }
    },
    CatchClause(path) {
      const body = path.node.body.body
      if (body.length === 1 && t.isThrowStatement(body[0])) {
        const parent = path.parentPath
        if (parent.isTryStatement()) {
          parent.replaceWith(parent.node.block)
          count++
        }
      }
      if (body.length === 1 && t.isExpressionStatement(body[0]) && t.isCallExpression(body[0].expression)) {
        const callee = body[0].expression.callee
        if (t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: 'error' })) {
          const parent = path.parentPath
          if (parent.isTryStatement()) {
            parent.replaceWith(parent.node.block)
            count++
          }
        }
      }
    },
  })

  return count
}
