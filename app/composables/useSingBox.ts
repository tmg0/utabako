export function useSingBox() {
  const service = createSingBox()
  const proxy = createSystemProxy()
  const store = useGlobalStore()
  const { isConnected } = storeToRefs(store)

  const isLoading = ref(false)
  const isAvailable = ref(service.isAvailable)

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

  async function restart() {
    if (!isConnected.value)
      return
    isLoading.value = true
    await service.stop()
    await service.start()
    isLoading.value = false
  }

  return {
    isLoading,
    isAvailable,
    enable,
    disable,
    restart,
  }
}
