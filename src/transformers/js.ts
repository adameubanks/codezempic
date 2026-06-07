import { parse } from '@babel/parser'
import generate from '@babel/generator'
import type { File } from '@babel/types'
import { stripJsComments } from '../rules/shared/comments'
import { applyBlankLineRules } from '../rules/shared/blank-lines'
import { getRulesForDose, type Dose, type RuleId } from '../rules/profiles'
import { removeUnusedImports } from '../rules/js/imports'
import { simplifyConditionals } from '../rules/js/conditionals'
import { stripTypes } from '../rules/js/types'
import { shortenVerboseNames } from '../rules/js/verbose-names'
import { removeBoilerplate } from '../rules/js/boilerplate'
import { removeAiPatterns } from '../rules/js/ai-patterns'

export interface TransformResult {
  code: string
  transformations: number
  error?: string
}

function parseCode(code: string, isTypeScript: boolean): File {
  return parse(code, {
    sourceType: 'module',
    plugins: isTypeScript ? ['typescript', 'jsx'] : ['jsx'],
    errorRecovery: false,
  }) as File
}

function applyAstRules(ast: File, rules: RuleId[]): number {
  let count = 0
  if (rules.includes('imports')) count += removeUnusedImports(ast)
  if (rules.includes('conditionals')) count += simplifyConditionals(ast)
  if (rules.includes('verboseNames')) count += shortenVerboseNames(ast, rules.includes('aiPatterns') ? 12 : 20)
  if (rules.includes('types')) count += stripTypes(ast)
  if (rules.includes('boilerplate')) count += removeBoilerplate(ast)
  if (rules.includes('aiPatterns')) count += removeAiPatterns(ast)
  return count
}

export function transformJs(code: string, dose: Dose, isTypeScript: boolean): TransformResult {
  const rules = getRulesForDose(dose)
  let result = code
  let transformations = 0

  try {
    if (rules.includes('comments')) {
      const before = result.length
      result = stripJsComments(result)
      if (result.length < before) transformations++
    }

    if (rules.includes('blankLines')) {
      result = applyBlankLineRules(result)
      transformations++
    }

    const needsAst = rules.some((r) =>
      ['imports', 'conditionals', 'verboseNames', 'types', 'boilerplate', 'aiPatterns'].includes(r)
    )

    if (needsAst) {
      const ast = parseCode(result, isTypeScript)
      transformations += applyAstRules(ast, rules)
      result = generate(ast, { retainLines: false, compact: false }).code
      if (rules.includes('blankLines')) {
        result = applyBlankLineRules(result)
      }
    }

    return { code: result, transformations }
  } catch {
    return {
      code: result,
      transformations: 0,
      error: 'This code is too thicc to parse. Try a lower dose.',
    }
  }
}
