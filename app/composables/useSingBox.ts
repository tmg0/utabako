export function useSingBox() {
  const service = createSingBox()
  const proxy = createSystemProxy()

  const isLoading = ref(false)

  async function enable() {
    isLoading.value = true
    service.start()
    await proxy.enable()
    isLoading.value = false
  }

  async function disable() {
    isLoading.value = true
    service.stop()
    await proxy.disable()
    isLoading.value = false
  }

  return {
    isLoading,
    enable,
    disable,
  }
}
