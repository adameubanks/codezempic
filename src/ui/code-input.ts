import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, drawSelection, keymap, placeholder } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { indentOnInput, StreamLanguage } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { go } from '@codemirror/lang-go'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import type { Language } from '../rules/profiles'
import { codezempicSyntaxHighlighting } from '../utils/syntax-theme'

const languageCompartment = new Compartment()

function langExtension(language: Language) {
  switch (language) {
    case 'typescript':
      return javascript({ typescript: true })
    case 'javascript':
      return javascript()
    case 'python':
      return python()
    case 'go':
      return go()
    case 'ruby':
      return StreamLanguage.define(ruby)
  }
}

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    backgroundColor: 'var(--editor-bg)',
    color: 'var(--text)',
  },
  '.cm-scroller': {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'var(--editor-font-size)',
    lineHeight: 'var(--editor-line-height)',
    fontWeight: '400',
    tabSize: '2',
  },
  '.cm-content': {
    padding: '1rem',
    caretColor: 'var(--primary)',
    color: 'var(--syntax-base)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--primary)',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent',
  },
  '& ::selection': {
    backgroundColor: 'var(--syntax-selection) !important',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--syntax-selection) !important',
  },
  '.cm-placeholder': {
    color: 'var(--text-muted)',
  },
})

const PLACEHOLDER =
  'No code yet. Feed me your AI slop.\n\nPaste code here or drag & drop a file...'

export function setupCodeInput(parent: HTMLElement, onChange: () => void) {
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: '',
      extensions: [
        history(),
        drawSelection(),
        indentOnInput(),
        codezempicSyntaxHighlighting,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        placeholder(PLACEHOLDER),
        editorTheme,
        languageCompartment.of(langExtension('javascript')),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange()
        }),
      ],
    }),
  })

  return {
    getValue() {
      return view.state.doc.toString()
    },
    setValue(value: string) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      })
    },
    setLanguage(language: Language) {
      view.dispatch({
        effects: languageCompartment.reconfigure(langExtension(language)),
      })
    },
  }
}
