import type { JSONContent } from '@tiptap/core'

// ---- Small helpers to keep the demo document readable ----
type Mark = NonNullable<JSONContent['marks']>[number]

const text = (value: string, ...marks: Mark[]): JSONContent => (marks.length ? { type: 'text', text: value, marks } : { type: 'text', text: value })
const bold: Mark = { type: 'bold' }
const italic: Mark = { type: 'italic' }
const underline: Mark = { type: 'underline' }
const strike: Mark = { type: 'strike' }
const code: Mark = { type: 'code' }
const color = (value: string): Mark => ({ type: 'textStyle', attrs: { color: value } })
const highlight = (value: string): Mark => ({ type: 'highlight', attrs: { color: value } })
const link = (href: string): Mark => ({ type: 'link', attrs: { href, target: '_blank' } })

const p = (...content: JSONContent[]): JSONContent => ({ type: 'paragraph', content })
const h = (level: number, value: string): JSONContent => ({ type: 'heading', attrs: { level }, content: [text(value)] })
const ul = (...items: JSONContent[][]): JSONContent => ({ type: 'bulletList', content: items.map(c => ({ type: 'listItem', content: [p(...c)] })) })
const ol = (...items: JSONContent[][]): JSONContent => ({ type: 'orderedList', attrs: { start: 1 }, content: items.map(c => ({ type: 'listItem', content: [p(...c)] })) })
function tasks(...items: [boolean, string][]): JSONContent {
  return {
    type: 'taskList',
    content: items.map(([checked, value]) => ({ type: 'taskItem', attrs: { checked }, content: [p(text(value))] })),
  }
}
const codeBlock = (value: string, language = 'ts'): JSONContent => ({ type: 'codeBlock', attrs: { language }, content: [text(value)] })
const cell = (type: 'tableHeader' | 'tableCell', value: string): JSONContent => ({ type, attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [p(text(value))] })
function table(header: string[], ...rows: string[][]): JSONContent {
  return {
    type: 'table',
    content: [
      { type: 'tableRow', content: header.map(v => cell('tableHeader', v)) },
      ...rows.map(r => ({ type: 'tableRow', content: r.map(v => cell('tableCell', v)) })),
    ],
  }
}

// Inline SVG so the demo works offline
const demoImage = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="#7952b3"/><text x="200" y="135" fill="#fff" font-family="sans-serif" font-size="36" text-anchor="middle">Bootstrap</text></svg>',
)}`

export const jsonValue: JSONContent = {
  type: 'doc',
  content: [
    h(1, 'Bootstrap Pro Tiptap'),
    p(
      text('A WYSIWYG rich-text editor for Vue 3 built on '),
      text('tiptap', link('https://github.com/ueberdosis/tiptap')),
      text(' and '),
      text('bootstrap-vue-next', link('https://github.com/bootstrap-vue-next/bootstrap-vue-next')),
      text('. It is a fork of '),
      text('vuetify-pro-tiptap', link('https://github.com/yikoyu/vuetify-pro-tiptap')),
      text(' with Vuetify replaced by Bootstrap 5.3.'),
    ),
    {
      type: 'image',
      attrs: { src: demoImage, alt: 'Bootstrap', title: null, lockAspectRatio: true, width: 240, height: null, display: 'right' },
    },
    h(2, 'Try it'),
    ul(
      [text('Select some text to open the '), text('bubble menu', bold), text('.')],
      [text('Use the toolbar for headings, alignment, fonts, colors, lists, links, images, video and tables.')],
      [text('Click the image and drag its corners to resize it.')],
      [text('Toggle '), text('dark', code), text(' mode at the top of the page. The editor follows Bootstrap\'s '), text('data-bs-theme', code), text(' attribute.')],
    ),
    h(2, 'Formatting'),
    p(
      text('Bold', bold),
      text(', '),
      text('italic', italic),
      text(', '),
      text('underline', underline),
      text(', '),
      text('strikethrough', strike),
      text(', '),
      text('inline code', code),
      text(', '),
      text('colored text', color('#d63384')),
      text(' and '),
      text('highlighted text', highlight('#ffeb3b')),
      text('.'),
    ),
    {
      type: 'blockquote',
      content: [p(text('Markdown shortcuts work too: type '), text('## ', code), text(' for a heading, '), text('- ', code), text(' for a list or '), text('> ', code), text(' for a quote.'))],
    },
    h(2, 'Lists'),
    ol([text('Install the package')], [text('Register the plugin')], [text('Drop '), text('<BootstrapTiptap>', code), text(' into a form')]),
    tasks([true, 'Replace Vuetify with bootstrap-vue-next'], [true, 'Follow Bootstrap color modes'], [false, 'Use it in talentbase']),
    h(2, 'Setup'),
    codeBlock(`import { createBootstrap } from 'bootstrap-vue-next'
import { BaseKit, Bold, createBootstrapProTipTap, Italic, Link } from 'bootstrap-pro-tiptap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-pro-tiptap/style.css'

app.use(createBootstrap())
app.use(createBootstrapProTipTap({
  extensions: [BaseKit, Bold, Italic, Link],
}))`),
    h(2, 'Components'),
    table(
      ['Component', 'Purpose'],
      ['BootstrapTiptap', 'The editor (v-model, toolbar, bubble menu, fullscreen)'],
      ['BootstrapViewer', 'Read-only, XSS-filtered rendering of saved content'],
      ['ActionButton', 'Base toolbar button for custom extensions'],
    ),
    { type: 'horizontalRule' },
    p(text('Original editor by '), text('yikoyu', link('https://github.com/yikoyu')), text('. MIT licensed.')),
  ],
}
