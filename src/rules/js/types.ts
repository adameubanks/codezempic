import traverse from '@babel/traverse'
import * as t from '@babel/types'
import type { File } from '@babel/types'

export function stripTypes(ast: File): number {
  let count = 0

  traverse(ast, {
    TSInterfaceDeclaration(path) {
      path.remove()
      count++
    },
    TSTypeAliasDeclaration(path) {
      path.remove()
      count++
    },
    TSEnumDeclaration(path) {
      path.remove()
      count++
    },
    ImportDeclaration(path) {
      if (path.node.importKind === 'type') {
        path.remove()
        count++
      }
    },
    ExportNamedDeclaration(path) {
      if (path.node.exportKind === 'type') {
        path.remove()
        count++
      }
    },
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.id) && path.node.id.typeAnnotation) {
        delete path.node.id.typeAnnotation
        count++
      }
    },
    Function(path) {
      for (const param of path.node.params) {
        if (t.isIdentifier(param) && param.typeAnnotation) {
          delete param.typeAnnotation
          count++
        }
      }
      if ('returnType' in path.node && path.node.returnType) {
        delete path.node.returnType
        count++
      }
      if ('typeParameters' in path.node && path.node.typeParameters) {
        delete path.node.typeParameters
        count++
      }
    },
    ClassProperty(path) {
      if (path.node.typeAnnotation) {
        delete path.node.typeAnnotation
        count++
      }
    },
    noScope: true,
  })

  return count
}
