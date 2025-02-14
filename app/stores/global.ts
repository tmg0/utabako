export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const tray = useTray()
  const proxy = createSystemProxy()

  async function isProxyAvailable() {
    const { is_enabled } = await proxy.get()
    return is_enabled
  }

  async function setup() {
    const v = await Promise.all([isProxyAvailable(), isSingBoxAvailable()])
    isConnected.value = v.every(i => i)
  }

  setup()

  return {
    tray,
    isConnected,
  }
})
