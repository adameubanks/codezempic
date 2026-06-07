import { stripJsComments } from '../rules/shared/comments'
import { applyBlankLineRules } from '../rules/shared/blank-lines'
import { getRulesForDose, type Dose } from '../rules/profiles'
import { removeUnusedGoImports } from '../rules/go/imports'
import { simplifyGoConditionals } from '../rules/go/conditionals'
import { shortenGoNames } from '../rules/go/verbose-names'
import { removeGoAiPatterns } from '../rules/go/ai-patterns'
import type { TransformResult } from './js'

export function transformGo(code: string, dose: Dose): TransformResult {
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

    if (rules.includes('imports')) {
      const { code: c, count } = removeUnusedGoImports(result)
      result = c
      transformations += count
    }

    if (rules.includes('conditionals')) {
      const { code: c, count } = simplifyGoConditionals(result)
      result = c
      transformations += count
    }

    if (rules.includes('verboseNames')) {
      const threshold = rules.includes('aiPatterns') ? 12 : 20
      const { code: c, count } = shortenGoNames(result, threshold)
      result = c
      transformations += count
    }

    if (rules.includes('aiPatterns')) {
      const { code: c, count } = removeGoAiPatterns(result)
      result = c
      transformations += count
    }

    if (rules.includes('blankLines')) {
      result = applyBlankLineRules(result)
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
