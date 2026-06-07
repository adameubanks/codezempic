import { DOSES, type Dose } from '../rules/profiles'

export function setupDoseSelector(
  container: HTMLElement,
  onChange: (dose: Dose) => void
): { getDose: () => Dose } {
  let current: Dose = 'medium'

  container.innerHTML = DOSES.map((d) => `
    <button class="dose-btn${d.id === current ? ' active' : ''}" data-dose="${d.id}" title="${d.includes}">
      <span class="dose-label">${d.label}</span>
      <span class="dose-desc">${d.description}</span>
    </button>
  `).join('')

  container.querySelectorAll('.dose-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      current = btn.getAttribute('data-dose') as Dose
      container.querySelectorAll('.dose-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
      onChange(current)
    })
  })

  return { getDose: () => current }
}
