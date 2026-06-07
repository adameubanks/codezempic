export type Dose = 'small' | 'medium' | 'large'
export type Language = 'javascript' | 'typescript' | 'python' | 'go' | 'ruby'

export interface DoseInfo {
  id: Dose
  label: string
  description: string
  includes: string
  excludes: string
}

export const DOSES: DoseInfo[] = [
  {
    id: 'small',
    label: 'Small Dose',
    description: 'Comments & whitespace only',
    includes: 'Strip comments, collapse blank lines, trim whitespace',
    excludes: 'No logic changes, no renaming, no import removal',
  },
  {
    id: 'medium',
    label: 'Medium Dose',
    description: 'Imports, conditionals & light naming',
    includes: 'Everything in Small + unused imports, simpler conditionals, light name shortening',
    excludes: 'No type stripping, no boilerplate removal',
  },
  {
    id: 'large',
    label: 'Large Dose',
    description: 'Full treatment: types, boilerplate & AI slop',
    includes: 'Everything in Medium + strip TS types, remove AI boilerplate, aggressive naming',
    excludes: 'Still avoids breaking minification-style transforms',
  },
]

export type RuleId =
  | 'comments'
  | 'blankLines'
  | 'imports'
  | 'conditionals'
  | 'verboseNames'
  | 'types'
  | 'boilerplate'
  | 'aiPatterns'

const DOSE_RULES: Record<Dose, RuleId[]> = {
  small: ['comments', 'blankLines'],
  medium: ['comments', 'blankLines', 'imports', 'conditionals', 'verboseNames'],
  large: ['comments', 'blankLines', 'imports', 'conditionals', 'verboseNames', 'types', 'boilerplate', 'aiPatterns'],
}

export function getRulesForDose(dose: Dose): RuleId[] {
  return DOSE_RULES[dose]
}
