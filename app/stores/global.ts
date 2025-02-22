export const useGlobalStore = defineStore('global', () => {
  const isConnected = ref(false)
  const { available } = useSingBox()
  const { servers } = useServers()

  async function setup() {
    isConnected.value = await available.value
  }

  setup()

  return {
    servers,
    isConnected,
  }
})
