import type { TransformStats } from '../utils/stats'

export function renderStats(panel: HTMLElement, stats: TransformStats): void {
  const linesDelta = stats.linesBefore - stats.linesAfter
  const charsDelta = stats.charsBefore - stats.charsAfter
  panel.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Line count</div>
      <div class="stat-value">${stats.linesBefore} → ${stats.linesAfter}</div>
      <div class="stat-delta">−${linesDelta} lines</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Weight (chars)</div>
      <div class="stat-value">${stats.charsBefore} → ${stats.charsAfter}</div>
      <div class="stat-delta">−${charsDelta} chars</div>
    </div>
    <div class="stat-card stat-card-highlight">
      <div class="stat-label">Total weight loss</div>
      <div class="stat-value stat-value-hero">${stats.percentReduction}%</div>
      <div class="stat-delta">slimmed down</div>
    </div>
  `
  panel.classList.add('visible')
}

export function hideStats(panel: HTMLElement): void {
  panel.classList.remove('visible')
}
