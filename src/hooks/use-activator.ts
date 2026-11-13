import type { InjectionKey, Ref } from 'vue'
import { inject, nextTick, onBeforeUnmount, provide } from 'vue'

type ActivateCallback = () => void

export interface Activator {
  /** The element that opened the popup (usually the toolbar button). */
  el: Readonly<Ref<HTMLElement | null>>
  /** Register a callback that runs each time the activator is clicked. */
  onActivate: (cb: ActivateCallback) => void
}

const ACTIVATOR_KEY: InjectionKey<Activator> = Symbol('bootstrap-pro-tiptap-activator')

/**
 * Provide an activator to slotted children (dialogs, menus, pickers).
 * Replaces Vuetify's `activator="parent"`.
 */
export function provideActivator(el: Readonly<Ref<HTMLElement | null>>) {
  const callbacks = new Set<ActivateCallback>()

  provide(ACTIVATOR_KEY, {
    el,
    onActivate(cb) {
      callbacks.add(cb)
      onBeforeUnmount(() => callbacks.delete(cb))
    },
  })

  return {
    // Defer so the button's own `action` (which usually prepares dialog props) settles first.
    activate: () => nextTick(() => callbacks.forEach(cb => cb())),
  }
}

/**
 * Access the enclosing ActionButton's activator from a custom dialog/menu component.
 *
 * @example
 * const dialog = ref(false)
 * useActivator()?.onActivate(() => (dialog.value = true))
 */
export function useActivator(): Activator | null {
  return inject(ACTIVATOR_KEY, null)
}
