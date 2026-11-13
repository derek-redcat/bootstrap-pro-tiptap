export { default as BootstrapTiptap } from './components/BootstrapTiptap.vue'
export { default as BootstrapViewer } from './components/BootstrapViewer.vue'

export { default as Icon } from './components/Icon.vue'

export * from './extensions'
export { useActivator, useContext } from './hooks'
export type { Activator } from './hooks'

export * from './install'
export * from './locales'
export type * from './type'

declare module 'vue' {
  export interface GlobalComponents {
    BootstrapTiptap: typeof import('./components/BootstrapTiptap.vue').default
    BootstrapViewer: typeof import('./components/BootstrapViewer.vue').default
  }
}
