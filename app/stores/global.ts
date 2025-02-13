export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const proxy = createSystemProxy()

  async function setup() {
    const { isEnabled } = await proxy.get()
    isConnected.value = isEnabled
  }

  setup()

  return {
    isConnected,
  }
})
