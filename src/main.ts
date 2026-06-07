import './styles/global.css'
import './styles/landing.css'
import 'prismjs/themes/prism-tomorrow.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-ruby'
import { SAMPLES } from '../examples/samples'

function doseLabel(dose: string): string {
  const map: Record<string, string> = { small: 'Small', medium: 'Medium', large: 'Large' }
  return map[dose] ?? dose
}

function langLabel(lang: string): string {
  const map: Record<string, string> = {
    javascript: 'JS',
    typescript: 'TS',
    python: 'Python',
    go: 'Go',
    ruby: 'Ruby',
  }
  return map[lang] ?? lang
}

function prismLang(lang: string): string {
  const map: Record<string, string> = {
    python: 'python',
    go: 'go',
    ruby: 'ruby',
    typescript: 'typescript',
  }
  return map[lang] ?? 'javascript'
}

const grid = document.getElementById('examples-grid')
if (grid) {
  grid.innerHTML = SAMPLES.map((s) => `
    <article class="example-card example-card-large">
      <div class="example-card-header">
        <div>
          <h3>${s.title}</h3>
          <div class="example-badges">
            <span class="badge badge-teal">${langLabel(s.language)}</span>
            <span class="badge badge-pink">${doseLabel(s.dose)} Dose</span>
            <span class="badge badge-yellow">-${s.reduction}% chars</span>
          </div>
        </div>
      </div>
      <div class="example-removed">
        <strong>Codezempic removes:</strong>
        <ul>${s.removed.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      </div>
      <div class="example-panels">
        <div class="example-panel before">
          <div class="example-panel-label">Before (bloated)</div>
          <pre class="mono"><code class="language-${prismLang(s.language)}">${escapeHtml(s.before)}</code></pre>
        </div>
        <div class="example-panel after">
          <div class="example-panel-label">After (skinnified)</div>
          <pre class="mono"><code class="language-${prismLang(s.language)}">${escapeHtml(s.after)}</code></pre>
        </div>
      </div>
    </article>
  `).join('')

  grid.querySelectorAll('pre code').forEach((el) => Prism.highlightElement(el as HTMLElement))
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
