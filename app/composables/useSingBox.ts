import { BaseDirectory, readTextFileLines } from '@tauri-apps/plugin-fs'

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

export function useSingBoxOutbounds() {
  const outbounds = useTauriStorage<Outbound[]>('outbounds', DEFAULT_OUTBOUNDS, 'config.json')

  return computed<ProxyOutbound[]>({
    get() {
      if (['shadowsocks', 'vmess'].includes(outbounds.value[0]?.type ?? '')) {
        return [outbounds.value[0]!] as ProxyOutbound[]
      }

      return []
    },

    set(value) {
      outbounds.value = [...value.map(defineSingBoxOutbound), ...DEFAULT_OUTBOUNDS]
    },
  })
}

export function useSingBoxConfig() {
  const log = useTauriStorage<Log>('log', DEFAULT_LOG, 'config.json')
  const dns = useTauriStorage('dns', DEFAULT_DNS, 'config.json')
  const ntp = useTauriStorage('ntp', {}, 'config.json')
  const endpoints = useTauriStorage('endpoints', [], 'config.json')
  const inbounds = useTauriStorage<Inbound[]>('inbounds', DEFAULT_INBOUNDS, 'config.json')
  const outbounds = useSingBoxOutbounds()
  const route = useTauriStorage('route', DEFAULT_ROUTE, 'config.json')
  const experimental = useTauriStorage('experimental', DEFAULT_EXPERIMENTAL, 'config.json')

  return {
    log,
    dns,
    ntp,
    endpoints,
    inbounds,
    outbounds,
    route,
    experimental,
  }
}

export function useSingBoxLog() {
  const text = ref<string[]>([])

  async function setup() {
    const lines = await readTextFileLines('SingBox.log', {
      baseDir: BaseDirectory.AppLog,
    })
    for await (const line of lines) {
      text.value.push(line)
    }
  }

  setup()

  return {
    text,
  }
}
