export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const { isAvailable } = useSingBox()
  const { servers } = useServers()

  async function setup() {
    isConnected.value = await isAvailable.value
  }

  setup()

  return {
    servers,
    isConnected,
  }
})
