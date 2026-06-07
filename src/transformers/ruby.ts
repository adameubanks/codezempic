import { stripRubyComments } from '../rules/shared/comments'
import { applyBlankLineRules } from '../rules/shared/blank-lines'
import { getRulesForDose, type Dose } from '../rules/profiles'
import { removeUnusedRubyImports } from '../rules/ruby/imports'
import { simplifyRubyConditionals } from '../rules/ruby/conditionals'
import { shortenRubyNames } from '../rules/ruby/verbose-names'
import { removeRubyAiPatterns } from '../rules/ruby/ai-patterns'
import type { TransformResult } from './js'

export function transformRuby(code: string, dose: Dose): TransformResult {
  const rules = getRulesForDose(dose)
  let result = code
  let transformations = 0

  try {
    if (rules.includes('comments')) {
      const before = result.length
      result = stripRubyComments(result)
      if (result.length < before) transformations++
    }

    if (rules.includes('blankLines')) {
      result = applyBlankLineRules(result)
      transformations++
    }

    if (rules.includes('imports')) {
      const { code: c, count } = removeUnusedRubyImports(result)
      result = c
      transformations += count
    }

    if (rules.includes('conditionals')) {
      const { code: c, count } = simplifyRubyConditionals(result)
      result = c
      transformations += count
    }

    if (rules.includes('verboseNames')) {
      const threshold = rules.includes('aiPatterns') ? 12 : 20
      const { code: c, count } = shortenRubyNames(result, threshold)
      result = c
      transformations += count
    }

    if (rules.includes('aiPatterns')) {
      const { code: c, count } = removeRubyAiPatterns(result)
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
