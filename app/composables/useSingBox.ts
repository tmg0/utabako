import { BaseDirectory, readTextFileLines } from '@tauri-apps/plugin-fs'
import { toast } from 'vue-sonner'

export function useSingBox() {
  const service = createSingBox()
  const { inbounds } = storeToRefs(useConfigStore())
  const { isConnected } = storeToRefs(useGlobalStore())

  const isLoading = ref(false)
  const available = ref(service.available)

  async function enable() {
    isLoading.value = true

    try {
      if (inbounds.value.some(({ type }) => type === 'tun'))
        await service.elevatePrivileges()
      await service.start()
    }
    catch {
      toast('Timeout', {
        description: 'Health check failed after 60 seconds',
      })
    }
    finally {
      isLoading.value = false
    }
  }

  async function disable() {
    isLoading.value = true
    await service.stop()
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
    available,
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
