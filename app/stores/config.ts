export const useConfigStore = defineStore('config', () => {
  const config = useSingBoxConfig()
  const { servers } = useServers()

  watchEffect(() => {
    if (!config.outbounds.value.length && servers.value.length)
      config.outbounds.value = [defineSingBoxOutbound(servers.value[0]!)]
  })

  return {
    ...config,
  }
})
