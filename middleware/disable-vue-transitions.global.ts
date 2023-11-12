export default defineNuxtRouteMiddleware(to => {
  if (import.meta.server || !document.startViewTransition) { return }

  // Desactivar transiciones de Vue
  to.meta.pageTransition = false
  to.meta.layoutTransition = false
})
