import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

export const codezempicHighlightStyle = HighlightStyle.define([
  { tag: tags.meta, color: 'var(--syntax-operator)' },
  { tag: tags.link, color: 'var(--syntax-keyword)', textDecoration: 'underline' },
  { tag: tags.heading, color: 'var(--syntax-keyword)', fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.keyword, color: 'var(--syntax-keyword)' },
  { tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName], color: 'var(--syntax-number)' },
  { tag: [tags.literal, tags.inserted], color: 'var(--syntax-builtin)' },
  { tag: [tags.string, tags.deleted], color: 'var(--syntax-string)' },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: 'var(--syntax-regex)' },
  { tag: tags.definition(tags.variableName), color: 'var(--syntax-function)' },
  { tag: tags.local(tags.variableName), color: 'var(--syntax-variable)' },
  { tag: [tags.typeName, tags.namespace], color: 'var(--syntax-type)' },
  { tag: tags.className, color: 'var(--syntax-type)' },
  { tag: [tags.special(tags.variableName), tags.macroName], color: 'var(--syntax-function)' },
  { tag: tags.definition(tags.propertyName), color: 'var(--syntax-function)' },
  { tag: tags.propertyName, color: 'var(--syntax-variable)' },
  { tag: tags.operator, color: 'var(--syntax-operator)' },
  { tag: tags.punctuation, color: 'var(--syntax-punctuation)' },
  { tag: tags.tagName, color: 'var(--syntax-tag)' },
  { tag: tags.attributeName, color: 'var(--syntax-attr)' },
  { tag: tags.attributeValue, color: 'var(--syntax-string)' },
  { tag: tags.comment, color: 'var(--syntax-comment)' },
  { tag: tags.invalid, color: 'var(--syntax-keyword)' },
])

export const codezempicSyntaxHighlighting = syntaxHighlighting(codezempicHighlightStyle, {
  fallback: true,
})
