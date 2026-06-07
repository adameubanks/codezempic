import './styles/global.css'
import './styles/syntax-theme.css'
import './styles/app.css'
import { transform } from './transformers'
import type { Language } from './rules/profiles'
import { detectLanguage, prismLanguage } from './utils/language-detect'
import { computeStats } from './utils/stats'
import { buildCodeFromSegments, computeDiffSegments, type DiffSegment } from './utils/diff'
import { renderOutputDiff } from './utils/highlight'
import { setupCodeInput } from './ui/code-input'
import { setupDoseSelector } from './ui/dose-selector'
import { setupFileDrop } from './ui/file-drop'
import { animateProgress } from './ui/progress'
import { renderStats, hideStats } from './ui/stats'

const outputCode = document.getElementById('code-output-code') as HTMLElement
const administerBtn = document.getElementById('administer-btn')!
const copyBtn = document.getElementById('copy-btn')!
const downloadBtn = document.getElementById('download-btn')!
const langSelect = document.getElementById('lang-select') as HTMLSelectElement
const errorBanner = document.getElementById('error-banner')!
const statsPanel = document.getElementById('stats-panel')!
const progressWrap = document.getElementById('progress-wrap')!
const progressFill = document.getElementById('progress-fill')!
const progressLabel = document.getElementById('progress-label')!
const dropOverlay = document.getElementById('drop-overlay')!

let currentOutput = ''
let currentFilename = 'skinnified-code.txt'
let diffView = false
let originalCode = ''
let diffSegments: DiffSegment[] = []
let rejectedHunks = new Set<number>()

const doseSelector = setupDoseSelector(
  document.getElementById('dose-selector')!,
  () => hideStats(statsPanel)
)

const codeInput = setupCodeInput(document.getElementById('code-input')!, () => {
  diffView = false
  clearDiffReview()
  hideStats(statsPanel)
  const value = codeInput.getValue()
  if (value.trim()) {
    const detected = detectLanguage(value)
    if (langSelect.value === 'javascript' || !langSelect.dataset.userSet) {
      langSelect.value = detected
      codeInput.setLanguage(detected)
    }
  }
})

setupFileDrop(dropOverlay, (content, filename) => {
  codeInput.setValue(content)
  currentFilename = filename.replace(/(\.\w+)?$/, '.skinnified$1')
  const detected = detectLanguage(content, filename)
  langSelect.value = detected
  codeInput.setLanguage(detected)
  diffView = false
  clearDiffReview()
  hideStats(statsPanel)
  outputCode.innerHTML = ''
  outputCode.removeAttribute('class')
})

administerBtn.addEventListener('click', () => {
  const code = codeInput.getValue().trim()
  if (!code) {
    showError('No code yet. Feed me your AI slop.')
    return
  }

  hideError()
  hideStats(statsPanel)

  animateProgress(progressWrap, progressFill, progressLabel, () => {
    const dose = doseSelector.getDose()
    const language = langSelect.value as Language
    const result = transform(code, dose, language)

    if (result.error) {
      showError(result.error)
      outputCode.innerHTML = ''
      outputCode.removeAttribute('class')
      return
    }

    originalCode = code
    diffSegments = computeDiffSegments(code, result.code)
    rejectedHunks = new Set()
    diffView = true
    refreshDiffView(language)
  })
})

function refreshDiffView(language = langSelect.value as Language) {
  currentOutput = buildCodeFromSegments(diffSegments, rejectedHunks)
  const lang = prismLanguage(language)
  outputCode.className = `language-${lang}`
  outputCode.innerHTML = renderOutputDiff(diffSegments, rejectedHunks, language)

  const stats = computeStats(originalCode, currentOutput)
  renderStats(statsPanel, stats)
  progressFill.style.width = `${Math.min(stats.percentReduction, 100)}%`
}

function clearDiffReview() {
  originalCode = ''
  diffSegments = []
  rejectedHunks.clear()
}

outputCode.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('.diff-reject-btn') as HTMLElement | null
  if (!btn || !diffView) return
  rejectedHunks.add(Number(btn.dataset.hunkId))
  refreshDiffView()
})

copyBtn.addEventListener('click', async () => {
  if (!currentOutput) return
  await navigator.clipboard.writeText(currentOutput)
  copyBtn.textContent = 'Copied!'
  setTimeout(() => { copyBtn.textContent = 'Copy' }, 1500)
})

downloadBtn.addEventListener('click', () => {
  if (!currentOutput) return
  const blob = new Blob([currentOutput], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = currentFilename
  a.click()
  URL.revokeObjectURL(url)
})

langSelect.addEventListener('change', () => {
  langSelect.dataset.userSet = 'true'
  codeInput.setLanguage(langSelect.value as Language)
})

function showError(msg: string) {
  errorBanner.textContent = msg
  errorBanner.classList.add('visible')
}

function hideError() {
  errorBanner.classList.remove('visible')
}
