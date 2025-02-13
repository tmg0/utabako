export function useSingBox() {
  const service = createSingBox()
  const proxy = createSystemProxy()

  const isLoading = ref(false)

  async function enable() {
    isLoading.value = true
    await Promise.all([
      service.start(),
      proxy.enable(),
    ])
    isLoading.value = false
  }

  async function disable() {
    isLoading.value = true
    await Promise.all([
      service.stop(),
      proxy.disable(),
    ])
    isLoading.value = false
  }

  return {
    isLoading,
    enable,
    disable,
  }
}
