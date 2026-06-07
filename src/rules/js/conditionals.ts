import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { File } from '@babel/types'

export function simplifyConditionals(ast: File): number {
  let count = 0

  traverse(ast, {
    IfStatement(path) {
      const test = path.node.test
      if (t.isBinaryExpression(test) && test.operator === '===' && t.isBooleanLiteral(test.right) && test.right.value === true) {
        path.node.test = test.left as t.Expression
        count++
      } else if (t.isBinaryExpression(test) && test.operator === '===' && t.isBooleanLiteral(test.right) && test.right.value === false) {
        path.node.test = t.unaryExpression('!', test.left as t.Expression)
        count++
      } else if (
        t.isLogicalExpression(test) &&
        test.operator === '&&' &&
        t.isBinaryExpression(test.left) &&
        test.left.operator === '!==' &&
        t.isNullLiteral(test.left.right) &&
        t.isBinaryExpression(test.right) &&
        test.right.operator === '!==' &&
        t.isIdentifier(test.right.left) &&
        t.isIdentifier(test.left.left) &&
        test.right.left.name === test.left.left.name &&
        t.isIdentifier(test.right.right, { name: 'undefined' })
      ) {
        path.node.test = t.binaryExpression('!=', test.left.left, t.nullLiteral())
        count++
      }
    },
    UnaryExpression(path) {
      if (path.node.operator === '!' && t.isUnaryExpression(path.node.argument, { operator: '!' })) {
        path.replaceWith(path.node.argument.argument)
        count++
      }
    },
  })

  return count
}
