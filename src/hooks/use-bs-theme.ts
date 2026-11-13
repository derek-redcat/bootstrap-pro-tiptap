import type { MaybeRefOrGetter, Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, toValue } from 'vue'

/**
 * Resolve whether a component should render dark, following Bootstrap 5.3 color modes.
 * An explicit `dark` value wins; otherwise the nearest ancestor `[data-bs-theme]` is used.
 */
export function useBsTheme(el: Ref<HTMLElement | null | undefined>, dark: MaybeRefOrGetter<boolean | undefined>) {
  const inheritedDark = ref(false)
  let observer: MutationObserver | undefined

  function detect() {
    const start = el.value?.parentElement ?? (typeof document !== 'undefined' ? document.documentElement : null)
    const themed = start?.closest('[data-bs-theme]')
    inheritedDark.value = themed?.getAttribute('data-bs-theme') === 'dark'
  }

  onMounted(() => {
    detect()
    observer = new MutationObserver(detect)
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-bs-theme'] })
  })

  onBeforeUnmount(() => observer?.disconnect())

  const isDark = computed<boolean>(() => {
    const value = toValue(dark)
    return typeof value === 'boolean' ? value : inheritedDark.value
  })

  /** Value for a `data-bs-theme` attribute; undefined means "inherit". */
  const themeAttr = computed<'dark' | 'light' | undefined>(() => {
    const value = toValue(dark)
    if (typeof value !== 'boolean')
      return undefined
    return value ? 'dark' : 'light'
  })

  return { isDark, themeAttr }
}
