import { stripPythonComments } from '../rules/shared/comments'
import { applyBlankLineRules } from '../rules/shared/blank-lines'
import { getRulesForDose, type Dose } from '../rules/profiles'
import { removeUnusedPythonImports } from '../rules/python/imports'
import { simplifyPythonConditionals } from '../rules/python/conditionals'
import { shortenPythonNames } from '../rules/python/verbose-names'
import { removePythonAiPatterns } from '../rules/python/ai-patterns'
import type { TransformResult } from './js'

export function transformPython(code: string, dose: Dose): TransformResult {
  const rules = getRulesForDose(dose)
  let result = code
  let transformations = 0

  try {
    if (rules.includes('comments')) {
      const before = result.length
      result = stripPythonComments(result)
      if (result.length < before) transformations++
    }

    if (rules.includes('blankLines')) {
      result = applyBlankLineRules(result)
      transformations++
    }

    if (rules.includes('imports')) {
      const { code: c, count } = removeUnusedPythonImports(result)
      result = c
      transformations += count
    }

    if (rules.includes('conditionals')) {
      const { code: c, count } = simplifyPythonConditionals(result)
      result = c
      transformations += count
    }

    if (rules.includes('verboseNames')) {
      const threshold = rules.includes('aiPatterns') ? 12 : 20
      const { code: c, count } = shortenPythonNames(result, threshold)
      result = c
      transformations += count
    }

    if (rules.includes('aiPatterns')) {
      const { code: c, count } = removePythonAiPatterns(result)
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
