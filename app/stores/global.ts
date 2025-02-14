export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const tray = useTray()

  async function setup() {
    isConnected.value = await isSingBoxAvailable()
  }

  setup()

  return {
    tray,
    isConnected,
  }
})
