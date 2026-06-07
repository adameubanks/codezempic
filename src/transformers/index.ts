import type { Dose, Language } from '../rules/profiles'
import { transformJs, type TransformResult } from './js'
import { transformPython } from './python'
import { transformGo } from './go'
import { transformRuby } from './ruby'

export function transform(code: string, dose: Dose, language: Language): TransformResult {
  if (language === 'python') return transformPython(code, dose)
  if (language === 'go') return transformGo(code, dose)
  if (language === 'ruby') return transformRuby(code, dose)
  return transformJs(code, dose, language === 'typescript')
}

export type { TransformResult }
