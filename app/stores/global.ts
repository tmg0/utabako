export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const { isAvailable } = useSingBox()

  async function setup() {
    isConnected.value = await isAvailable.value
  }

  setup()

  return {
    isConnected,
  }
})
