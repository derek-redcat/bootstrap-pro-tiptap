# Bootstrap Pro Tiptap

A WYSIWYG rich-text editor using [tiptap](https://github.com/ueberdosis/tiptap) and [bootstrap-vue-next](https://github.com/bootstrap-vue-next/bootstrap-vue-next) (Bootstrap 5.3) for Vue 3.

> This is a fork of [yikoyu/vuetify-pro-tiptap](https://github.com/yikoyu/vuetify-pro-tiptap) (branch `2.8.x`) with Vuetify replaced by Bootstrap. All credit for the editor, extensions and i18n goes to the original author.

## Features
- Uses [bootstrap-vue-next](https://bootstrap-vue-next.github.io/bootstrap-vue-next/) components (no Vuetify)
- Follows Bootstrap 5.3 color modes (`data-bs-theme="dark"`)
- Many out of box [extension](#extensions)
- Markdown support
- TypeScript support
- I18n support(`en`, `zhHans`, `nl`, `tr`, `de`, `fr`, `it`, `pt`, `hu`)

## Differences from vuetify-pro-tiptap

| vuetify-pro-tiptap | bootstrap-pro-tiptap |
| ---- | ---- |
| `VuetifyTiptap`, `VuetifyViewer` | `BootstrapTiptap`, `BootstrapViewer` |
| `createVuetifyProTipTap` | `createBootstrapProTipTap` |
| `VuetifyTiptapOnChange` | `BootstrapTiptapOnChange` |
| CSS classes `vuetify-pro-tiptap*` | `bootstrap-pro-tiptap*` |
| Theme from Vuetify `useTheme()` | Nearest ancestor `[data-bs-theme]`, or the `dark` prop |
| Custom dialogs use `activator="parent"` | Custom dialogs call `useActivator()` (see [Custom extensions](#custom-extensions)) |
| Icons rendered with `VIcon` | Icons rendered as inline SVG (`Icon` component, accepts `@mdi/js` paths) |

## Installation
### From git

```shell
pnpm add github:derek-redcat/bootstrap-pro-tiptap#bootstrap bootstrap bootstrap-vue-next
```

> `lib/` is build output and is not committed. Installing from git requires either committing a build or adding a `prepare` build script; publishing to a (private) registry is the simplest option.

### Peer dependencies
- `vue` ^3.5
- `bootstrap` ^5.3 (you import its CSS)
- `bootstrap-vue-next` ^1.2

### Install plugin

<details>
<summary>tiptap.ts</summary>

```TypeScript
import { markRaw } from 'vue'
import { BootstrapTiptap, BootstrapViewer, createBootstrapProTipTap } from 'bootstrap-pro-tiptap'
import { BaseKit, Bold, Italic, Underline, Strike, Color, Highlight, Heading, TextAlign, FontFamily, FontSize, SubAndSuperScript, BulletList, OrderedList, TaskList, Indent, Link, Image, Video, Table, Blockquote, HorizontalRule, Code, CodeBlock, Clear, Fullscreen, History } from 'bootstrap-pro-tiptap'
import 'bootstrap-pro-tiptap/style.css'
import SelectImage from './components/SelectImage.vue'

export const bootstrapProTipTap = createBootstrapProTipTap({
  lang: 'zhHans',
  fallbackLang: 'en',
  components: {
    BootstrapTiptap,
    BootstrapViewer
  },
  extensions: [
    BaseKit.configure({
      placeholder: {
        placeholder: 'Enter some text...'
      }
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    Code.configure({ divider: true }),
    Heading,
    TextAlign,
    FontFamily,
    FontSize,
    Color,
    Highlight.configure({ divider: true }),
    SubAndSuperScript.configure({ divider: true }),
    Clear.configure({ divider: true }),
    BulletList,
    OrderedList,
    TaskList,
    Indent.configure({ divider: true }),
    Link,
    Image.configure({
      imageTabs: [{ name: 'SELECT', component: markRaw(SelectImage) }],
      // hiddenTabs: ['upload'],
      upload(file: File) {
        const url = URL.createObjectURL(file)
        console.log('mock upload api :>> ', url)
        return Promise.resolve(url)
      }
    }),
    Video,
    Table.configure({ divider: true }),
    Blockquote,
    HorizontalRule,
    CodeBlock.configure({ divider: true }),
    History.configure({ divider: true }),
    Fullscreen
  ]
})
```

</details>

<details>
<summary>main.ts</summary>

```typescript
import { createBootstrap } from 'bootstrap-vue-next'
import { createApp } from 'vue'
import App from './App.vue'
import { bootstrapProTipTap } from './tiptap'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)
app.use(createBootstrap())
app.use(bootstrapProTipTap)
app.mount('#app')
```

</details>

## Global Settings
```TypeScript
import { markRaw } from 'vue'
import { BootstrapTiptap, BootstrapViewer, createBootstrapProTipTap, defaultBubbleList } from 'bootstrap-pro-tiptap'
import { BaseKit, Image, Fullscreen } from 'bootstrap-pro-tiptap'
import 'bootstrap-pro-tiptap/style.css'
import SelectImage from './components/SelectImage.vue'

export const bootstrapProTipTap = createBootstrapProTipTap({
  // Set default lang
  lang: 'zhHans',
  // Set default fallback lang
  fallbackLang: 'en',
  // Set markdown theme
  markdownTheme: 'github',
  // Global registration app.component
  components: {
    BootstrapTiptap,
    BootstrapViewer
  },
  // Global registration extensions
  extensions: [
    BaseKit.configure({
      placeholder: {
        placeholder: 'Enter some text...'
      },
      bubble: {
        // default config
        list: {
          image: [ 'float-left', 'float-none', 'float-right', 'divider', 'size-small', 'size-medium', 'size-large', 'divider', 'textAlign', 'divider', 'image', 'image-aspect-ratio', 'remove'],
          text: ['bold', 'italic', 'underline', 'strike', 'divider', 'color', 'highlight', 'textAlign', 'divider', 'link'],
          video: ['video', 'remove']
        },
        defaultBubbleList: editor => {
          // You can customize the bubble menu here
          return defaultBubbleList(editor) // default customize bubble list
        }
      }
    }),
    Image.configure({
      // Generate a VDivider after the button
      divider: true,
      // Custom image tabs
      imageTabs: [{ name: 'SELECT', component: markRaw(SelectImage) }],
      // hidden default tab
      hiddenTabs: ['upload'],
      // custom upload function
      upload(file) {
        const url = URL.createObjectURL(file)
        console.log('mock upload api :>> ', url)
        return Promise.resolve(url)
      }
    }),
    Fullscreen.configure({
      // Generate a VSpacer after the button
      spacer: true
    })
  ]
})
```

## <span id="extensions">Extensions</span>

You can use the necessary extensions. The corresponding command-buttons will be added by declaring the order of the extension.

All available extensions：

- [`BaseKit`](./src/extensions/base-kit.ts)
- [`Bold`](./src/extensions/bold.ts)
- [`Italic`](./src/extensions/italic.ts)
- [`Underline`](./src/extensions/underline.ts)
- [`Strike`](./src/extensions/strike.ts)
- [`Color`](./src/extensions/color.ts)
- [`Highlight`](./src/extensions/highlight.ts)
- [`Heading`](./src/extensions/heading.ts)
- [`TextAlign`](./src/extensions/text-align.ts)
- [`FontFamily`](./src/extensions/font-family.ts)
- [`FontSize`](./src/extensions/font-size.ts)
- [`SubAndSuperScript`](./src/extensions/subscript.ts)
- [`BulletList`](./src/extensions/bullet-list.ts)
- [`OrderedList`](./src/extensions/ordered-list.ts)
- [`TaskList`](./src/extensions/task-list.ts)
- [`Indent`](./src/extensions/indent.ts)
- [`Link`](./src/extensions/link.ts)
- [`MarkdownTheme`](./src/extensions/markdown-theme.ts)
- [`Image`](./src/extensions/image.ts)
- [`Video`](./src/extensions/video.ts)
- [`Table`](./src/extensions/table.ts)
- [`Blockquote`](./src/extensions/blockquote.ts)
- [`HorizontalRule`](./src/extensions/horizontal-rule.ts)
- [`Code`](./src/extensions/code.ts)
- [`CodeBlock`](./src/extensions/code-block.ts)
- [`Clear`](./src/extensions/clear.ts)
- [`Fullscreen`](./src/extensions/fullscreen.ts)
- [`History`](./src/extensions/history.ts)

## Custom theme

Create github.scss

```scss
$value: 'github';

.bootstrap-pro-tiptap-editor__content.markdown-theme-#{$value} {
  &.__dark {
    // your dark mode custom styles
  }

  .tiptap.ProseMirror,
  .content {
    // your custom styles
  }
}
```

Import github.scss in ts

```typescript
// import 'bootstrap-pro-tiptap/style.css' // import all(editor and markdown) styles
import 'bootstrap-pro-tiptap/styles/editor.css' // only use editor style, not using markdown style
import './styles/markdown/github.scss'
```

In the component using

```vue
<template>
  <BootstrapTiptap v-model="content" markdown-theme="github" />
  <BootstrapViewer :value="content" markdown-theme="github" />
</template>
```

## Custom extensions

<details>
<summary>PreviewActionButton.vue</summary>

```vue
<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { mdiFileCodeOutline } from '@mdi/js'
import { ActionButton, BootstrapViewer, Icon } from 'bootstrap-pro-tiptap'
import { BModal } from 'bootstrap-vue-next'
import { ref } from 'vue'

withDefaults(defineProps<{ editor: Editor, disabled?: boolean }>(), { disabled: false })

const dialog = ref(false)
</script>

<template>
  <ActionButton :editor="editor" tooltip="Preview" :disabled="disabled" :action="() => (dialog = true)">
    <template #icon>
      <Icon :icon="mdiFileCodeOutline" />
    </template>

    <BModal v-model="dialog" fullscreen title="Preview" no-footer>
      <BootstrapViewer :value="editor.getHTML()" />
    </BModal>
  </ActionButton>
</template>
```

</details>

<details>
<summary>Custom dialog component (e.g. <code>Link.configure({ dialogComponent: () => MyLinkDialog })</code>)</summary>

Dialog components are rendered inside the toolbar button. Call `useActivator()` to open when the button is clicked (this replaces Vuetify's `activator="parent"`):

```vue
<script setup lang="ts">
import { useActivator } from 'bootstrap-pro-tiptap'
import { BModal } from 'bootstrap-vue-next'
import { ref } from 'vue'

const dialog = ref(false)
useActivator()?.onActivate(() => {
  dialog.value = true
})
</script>

<template>
  <BModal v-model="dialog" title="Insert link">
    ...
  </BModal>
</template>
```

</details>

<details>
<summary>preview.ts</summary>

```typescript
import type { GeneralOptions } from 'bootstrap-pro-tiptap'
import { Extension } from '@tiptap/core'

import PreviewActionButton from '../components/PreviewActionButton.vue'

export type PreviewOptions = GeneralOptions<PreviewOptions>

export default Extension.create<PreviewOptions>({
  name: 'preview',
  addOptions() {
    return {
      divider: false,
      spacer: false,
      button: ({ editor }) => ({
        component: PreviewActionButton,
        componentProps: {
          editor,
        },
      }),
    }
  },
})
```

</details>

## I18n

### Setting language
You can declare when you install the plugin.
```TypeScript
import { createBootstrapProTipTap } from 'bootstrap-pro-tiptap'

const BootstrapProTipTap = createBootstrapProTipTap({
  lang: 'zhHans',
  fallbackLang: 'en'
})
```
Or use `setLang` dynamic change
```TypeScript
import { locale } from 'bootstrap-pro-tiptap'

locale.setLang('en')
```
Available languages:
- en (default)
- zhHans
- nl
- tr
- de
- fr
- it
- pt
- hu

### Use unavailable language
Loading unavailable language, use `setMessage` for Settings
```TypeScript
import { locale } from 'bootstrap-pro-tiptap'

locale.setMessage('zhHant', {
  // i18n text
})
locale.setLang('zhHant')
```

## Usage
```vue
<script setup lang="ts">
import { BaseKit, Bold, BootstrapTiptap, BootstrapViewer, Color, Fullscreen, Heading, Highlight, History, Image, Italic, Link, Strike, Table, Underline, Video } from 'bootstrap-pro-tiptap'
import { ref } from 'vue'
import 'bootstrap-pro-tiptap/style.css'

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: 'Enter some text...'
    }
  }),
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  Link,
  Image,
  Video,
  Table,
  Fullscreen,
  History
]

const content = ref('')
</script>

<template>
  <VApp id="app">
    <VContainer>
      <BootstrapTiptap v-model="content" label="Title" rounded :min-height="200" :max-height="465" :max-width="900" :extensions="extensions" />
      <BootstrapViewer :value="content" />
    </VContainer>
  </VApp>
</template>
```

## Props

### BootstrapTiptap

#### Props
| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| modelValue | string \| JSONContent | '' | The input’s value |
| markdownTheme | string \| false | 'default' | Markdown theme |
| output | 'html' \| 'json' \| 'text' | 'html' | Output format |
| dark | boolean | undefined | Force dark (`true`) or light (`false`); otherwise inherits the nearest `[data-bs-theme]`. |
| dense | boolean | false | Reduces the input height |
| outlined | boolean | true | Applies the outlined style to the input |
| flat | boolean | true | Removes the card’s shadow |
| disabled | boolean | false | Disable the input |
| label | string | undefined | Sets input label |
| hideToolbar | boolean | false | Hidden the toolbar |
| disableToolbar | boolean | false | Disable the toolbar |
| hideBubble | boolean | false | Hidden the bubble menu |
| removeDefaultWrapper | boolean | false | Default wrapper when the delete editor is empty |
| maxWidth | string \| number | undefined | Sets the maximum width for the component. |
| minHeight | string \| number | undefined | Sets the minimum height for the component. |
| maxHeight | string \| number | undefined | Sets the maximum height for the component. |
| extensions | AnyExtension[] | [] | Tiptap the extensions |
| editorClass | string \| string[] \| Record\<string, any> | undefined | Editor class |
| errorMessages | string \| string[] \| null | [] | Validation messages shown below the editor (adds `border-danger`) |

#### Slots
| Name | Description |
| ---- | ---- |
| editor | Slot to customize editor |
| bottom | Slot to customize editor bottom |

#### Event
| Name | Type | Description |
| ---- | ---- | ---- |
| update:modelValue | string \| JSONContent | Emitted when editor onUpdate |
| update:markdownTheme | string | Emitted when change theme |
| change | { editor: Editor, output: string \| JSONContent } | Emitted when editor onUpdate |
| enter | | Keyboard enter return |

### BootstrapViewer

#### Props
| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| value | string \| JSONContent | '' | The preview’s value |
| dark | boolean | undefined | Force dark (`true`) or light (`false`); otherwise inherits the nearest `[data-bs-theme]`. |
| dense | boolean | false | Reduces the input height |
| markdownTheme | string \| false | 'default' | Markdown theme |
| xss | boolean | true | Enable xss filter |
| xssOptions | xss.IWhiteList | Default rule | Xss filter rule config |
| maxWidth | string \| number | undefined | Sets the maximum width for the component. |
| extensions | AnyExtension[] | [] | Tiptap the extensions |

#### Slots
| Name | Description |
| ---- | ---- |
| before | Add content at the before |
| after | Add content at the after |

## 🏗 Contributing

1. 🍴Fork it
2. 🔀Create your branch: `git checkout -b your-branch`
3. 🎨Make your changes
4. 📝Commit your changes with [Semantic Commit Messages (recommended)](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
5. 🚀Push to the branch: `git push origin your-branch`
6. 🎉Submit a PR to `develop` branch

## 📄 License

[MIT](./LICENSE)

## Thanks

- [vuetify-pro-tiptap](https://github.com/yikoyu/vuetify-pro-tiptap) by yikoyu (upstream)
- [bootstrap-vue-next](https://github.com/bootstrap-vue-next/bootstrap-vue-next)
- [tiptap](https://github.com/scrumpy/tiptap)
- [element-tiptap](https://github.com/Leecason/element-tiptap)
