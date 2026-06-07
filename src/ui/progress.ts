export function animateProgress(
  wrap: HTMLElement,
  fill: HTMLElement,
  label: HTMLElement,
  onComplete: () => void
): void {
  wrap.classList.add('visible')
  fill.style.width = '0%'
  label.textContent = 'Applying dose...'

  const messages = [
    'Applying dose...',
    'Trimming comments...',
    'Cinching the bloat...',
    'Checking code BMI...',
  ]
  let step = 0

  const interval = setInterval(() => {
    step++
    fill.style.width = `${Math.min(step * 25, 100)}%`
    label.textContent = messages[Math.min(step - 1, messages.length - 1)]
    if (step >= 4) {
      clearInterval(interval)
      setTimeout(() => {
        wrap.classList.remove('visible')
        fill.style.width = '0%'
        onComplete()
      }, 150)
    }
  }, 75)
}
