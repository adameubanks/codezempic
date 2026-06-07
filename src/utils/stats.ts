export interface TransformStats {
  linesBefore: number
  linesAfter: number
  charsBefore: number
  charsAfter: number
  percentReduction: number
}

export function computeStats(before: string, after: string): TransformStats {
  const linesBefore = before.split('\n').length
  const linesAfter = after.split('\n').length
  const charsBefore = before.length
  const charsAfter = after.length
  const percentReduction = charsBefore > 0
    ? Math.round(((charsBefore - charsAfter) / charsBefore) * 100)
    : 0

  return {
    linesBefore,
    linesAfter,
    charsBefore,
    charsAfter,
    percentReduction,
  }
}
